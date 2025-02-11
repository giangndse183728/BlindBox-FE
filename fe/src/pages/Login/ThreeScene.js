// src/ThreeScene.js

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';



const ThreeScene = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const materialRef = useRef(null);


  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Set dimensions to match container size instead of fixed values
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark background
    const camera = new THREE.PerspectiveCamera(22, width / height, 0.2, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add a flag to track if model is already loaded
    let modelLoaded = false;

    // Add texture loader setup
    const textureLoader = new THREE.TextureLoader();
    
// Load all textures
const baseColorMap = textureLoader.load('/assets/3d/SMO_MysteryBlock_SHD_D.png');
const normalMap = textureLoader.load('/assets/3d/SMO_MysteryBlock_SHD_N.png'); // Provide correct file path
const aoMap = textureLoader.load('/assets/3d/SMO_MysteryBlock_SHD_O.png'); // Provide correct file path
const heightMap = textureLoader.load('/assets/3d/SMO_MysteryBlock_SHD_H.png'); // Provide correct file path
const metalnessMap = textureLoader.load('/assets/3d/SMO_MysteryBlock_SHD_M.png');

// Create material with updated properties
const material = new THREE.MeshStandardMaterial({
  map: baseColorMap,  // Base color texture
  normalMap: normalMap,  // Normal map for surface detail
  aoMap: aoMap,  // Ambient occlusion map for shadow details
  aoMapIntensity: 1.0,  // Control ambient occlusion intensity
  displacementMap: heightMap,  // Height map for surface displacement
  displacementScale: 0.1,  // Control displacement effect intensity
  metalnessMap: metalnessMap, 
  metalness: 1.0,
});

// Assign material reference
materialRef.current = material;


    // Load 3D model of furniture
    const loader = new GLTFLoader();
    loader.load("/assets/3d/luckbox.glb", (gltf) => {
      if (!modelLoaded) {
        // Create multiple instances
        const numberOfModels = 6; // You can adjust this number
        const radius = 2.0; // Distance from center
        
        for (let i = 0; i < numberOfModels; i++) {
          const furniture = gltf.scene.clone(); // Clone the loaded model
          
          // Calculate position on the circle
          const angle = (i / numberOfModels) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          
          // Apply material and transformations
          furniture.traverse((child) => {
            if (child.isMesh) {
              child.material = material;
            }
          }); 
          
          furniture.scale.set(0.9, 0.9, 0.9);
          furniture.position.set(x, 0.3, z);
          furniture.rotation.y = angle + Math.PI / 2; // Face outward
          
          scene.add(furniture);
          
          // Store the first model reference for rotation
          if (i === 0) {
            modelRef.current = furniture;
          }
        }
        modelLoaded = true;
      }
    });

    // Update lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Dim ambient light
    scene.add(ambientLight);

    // Add point lights
    const pointLight1 = new THREE.PointLight(0xffffff, 1, 10);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff9900, 1, 20); // Warm light
    pointLight2.position.set(-2, 1, -4);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x0066ff, 1, 20); // Cool light
    pointLight3.position.set(0, -2, 2);
    scene.add(pointLight3);
    
    // Add orbit controls for camera interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disable user camera movement

    // Adjust camera position for better view
    camera.position.z = 7;
    camera.position.y = 2.8;
    camera.position.x = 1;

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      // Rotate all models
      const radius = 2.0; // Distance from center
      const time = Date.now() * 0.0001; // Use time for smooth movement
      scene.children.forEach((child, index) => {
        if (child.type === 'Group') { // GLTF models are loaded as Groups
          const angle = time + (index * Math.PI / 3); // Adjust angle for each model
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          child.position.set(x, 0.3, z); // Update position in a circular path
          child.rotation.y += 0.005; 
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Add window resize handler
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Add event listener for mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.isMesh) {
          clickedObject.scale.set(1.5, 1.5, 1.5); // Scale up the clicked model
          
          // Make the model lighter
          clickedObject.material.metalness = Math.min(clickedObject.material.metalness + 0.1, 1); // Increase metalness
          clickedObject.material.opacity = Math.min(clickedObject.material.opacity + 0.1, 1); // Increase opacity
          clickedObject.material.transparent = true; // Ensure material is transparent
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Update cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      scene.clear();
    };
  }, []); // Make sure dependencies array is empty

  return (
    <>
       <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,244,230,0.12) 0%, rgba(255,244,230,0) 70%)', // Warm sunlight
        zIndex: -1,
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(230,240,255,0.12) 0%, rgba(230,240,255,0) 70%)', // Cool daylight
        zIndex: -1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,250,245,0.10) 0%, rgba(255,250,245,0) 70%)', // Soft ambient
        zIndex: -1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '400px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(240,245,255,0.10) 0%, rgba(240,245,255,0) 70%)', // Cool ambient
        zIndex: -1,
      }} />

<div style={{
        position: 'fixed',
        bottom: 150,
        right: 550,
        width: '400px',
        height: '500px',
        background: 'radial-gradient( rgba(240,245,255,0.10) 0%, rgba(240,245,255,0) 70%)', // Cool ambient
        zIndex: -1,
      }} />
      
      {/* Three.js canvas */}
      <div ref={containerRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        overflow: 'hidden'
      }} />
    </>
  );
};

export default ThreeScene;
