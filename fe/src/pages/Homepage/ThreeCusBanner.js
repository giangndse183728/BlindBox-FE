import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import ColorPicker from "./ColorPicker";
import { Grid, Typography, LinearProgress } from '@mui/material';
import GlassCard from "../../components/Decor/GlassCard";
import { yellowGlowAnimation } from "../../components/Text/YellowEffect";
import ButtonCus from "../../components/Button/ButtonCus";

const ThreeCus = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const modelsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfModels, setNumberOfModels] = useState(50); 
  const [modelGroups, setModelGroups] = useState([{ color: '#BED3F3', count: 50 }]);

  const baseRadius = 0.2; 
  
  
  // Calculate the radius based on numberOfModels instead of totalModels
  const radius = baseRadius + numberOfModels * 0.18;

  // Scene setup
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      20,
      700 / 500,
      0.5,
      1000
    );
    camera.position.set(40, 35, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    renderer.setSize(700, 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 40);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 20);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 8;
    controls.maxDistance = 100;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  // Handle sphere creation and updates
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    setIsLoading(true);

    // Clear existing spheres
    modelsRef.current.forEach(model => {
      scene.remove(model);
      if (model.geometry) model.geometry.dispose();
      if (model.material) model.material.dispose();
    });
    modelsRef.current = [];

    // Create spheres
    let currentIndex = 0;
    
    modelGroups.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
     
        const position = geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {
          const v = new THREE.Vector3().fromBufferAttribute(position, i);
          
          const originalLength = v.length(); 
          v.normalize().multiplyScalar(originalLength * (1 + Math.random() * 0.3)); 
          
          position.setXYZ(i, v.x, v.y, v.z);
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      
        
        // Create gem-like material with the group's color
        const gemMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(group.color),
          metalness: 0.9,
          roughness: 0.1,
          envMapIntensity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          ior: 2.5,
          reflectivity: 1,
          transmission: 0.95,
          thickness: 5,
          opacity: 1,
          transparent: true,
          flatShading: true 
        });

        const sphere = new THREE.Mesh(geometry, gemMaterial);
        
        // Calculate position with spacing
        const angleStep = (Math.PI * 2) / numberOfModels;
        const currentAngle = currentIndex * angleStep;
        const x = radius * Math.cos(currentAngle);
        const z = radius * Math.sin(currentAngle);
        
        sphere.position.set(x, 0, z);
        sphere.rotation.y = -currentAngle;
        
        scene.add(sphere);
        modelsRef.current.push(sphere);
        currentIndex++;
      }
    });
    setIsLoading(false);
  }, [numberOfModels, modelGroups, radius]);

  // Add environment map for better reflections
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const renderer = rendererRef.current;

    // Create a simple environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x000000);

    // Add some colored lights to create reflections
    const lights = [
      { color: 0xff0000, position: [5, 5, 5] },
      { color: 0x00ff00, position: [-5, 5, -5] },
      { color: 0x0000ff, position: [-5, -5, 5] },
      { color: 0xffff00, position: [5, -5, -5] },
    ];

    lights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, 1, 150);
      pointLight.position.set(...light.position);
      envScene.add(pointLight);
    });

    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    return () => {
      envMap.dispose();
      pmremGenerator.dispose();
    };
  }, []);

  // Animation update
  useEffect(() => {
    const animate = () => {
      const time = performance.now() * 0.001;
      const speed = 0.1;

      modelsRef.current.forEach((model, index) => {
        const angleOffset = (index / numberOfModels) * Math.PI * 2;
        const currentAngle = time * speed + angleOffset;
        
        const x = radius * Math.cos(currentAngle);
        const z = radius * Math.sin(currentAngle);
        
        model.position.x = x;
        model.position.z = z;
        model.rotation.y = -currentAngle;
      });
    };

    const animationInterval = setInterval(animate, 16);

    return () => clearInterval(animationInterval);
  }, [numberOfModels, radius]);

  // Update handlers to modify numberOfModels
  const handleAddModels = (color, count) => {
    const newTotal = numberOfModels + count;
  
    if (newTotal <= 120) {
      setNumberOfModels(prev => prev + count);
      setModelGroups(prev => [...prev, { color, count }]);
    } else {
      // Optionally show an alert or message to the user that the limit is reached
      alert('You can create a maximum of 120 models!');
    }
  };

  const handleRemoveAll = () => {
    setNumberOfModels(0);
    setModelGroups([]);
  };

  return (
    <>
      <Grid container data-aos="fade-up" sx={{ mb: 3 }}>
        <Grid item xs={3} >
        <Typography 
          fontFamily="'Jersey 15', sans-serif" 
          variant='h4' 
          sx={{ 
            mt: 5, 
            mb: 3, 
            ml: 6, 
            color: "white",
            ...yellowGlowAnimation
          }} 
          data-aos="fade-up" 
          data-aos-delay="200"
        >  
          Personalized Accessories  <br /> Your Way 
        </Typography>
        <Typography  variant='subtitle1' sx={{ mt: 2, mb: 3, ml: 6,  color: "white" }} data-aos="fade-up" data-aos-delay="200"> Express your individuality with our customizable accessories! Choose from a variety of shapes and colors to create a piece that matches your style. Adjust the number of elements and arrange them in unique patterns like a bracelet. Your creativity, your design! </Typography>
        <ButtonCus variant="button-85" width="250px" sx={{display: 'flex', justifyContent: 'center'}}> TRY NOW</ButtonCus>
        </Grid>
        <Grid item xs={6}>
          <div
            ref={containerRef}
            style={{
              overflow: "hidden",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <GlassCard>
            <ColorPicker 
              onAddModels={handleAddModels} 
              onRemoveAll={handleRemoveAll} 
              isLoading={isLoading} 
            />
                <Typography fontFamily="'Jersey 15', sans-serif" variant="h6" sx={{ mt: 1, textAlign: "center", color: "white" }}>
      Total Models: {numberOfModels}
    </Typography>
    <LinearProgress 
            variant="determinate" 
            value={(numberOfModels / 120) * 100} 
            sx={{ height: 10, borderRadius: 5 }}
          />
    
          </GlassCard>
        </Grid>
      </Grid>
    </>
  );
};

export default ThreeCus;