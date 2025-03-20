import React, { useEffect, useRef, useState } from "react";
import { CustomBoard, BeadInfo } from "./CustomBoard";
import GlassCard from "../../components/Decor/GlassCard";
import html2canvas from 'html2canvas';
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { 
  Grid, Typography, LinearProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Box, IconButton 
} from '@mui/material';
import { yellowGlowAnimation } from "../../components/Text/YellowEffect";
import ButtonCus from "../../components/Button/ButtonCus";
import CloseIcon from '@mui/icons-material/Close';
import { fetchBeads, createCustomAccessory } from "../../services/accessoryApi";
import { toast } from 'react-toastify';
import useCartStore from '../Shoppingcart/CartStore'; // Import the cart store
import { uploadImage } from "../../services/productApi"; // Import the uploadImage function

const ThreeCustom = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const modelsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfModels, setNumberOfModels] = useState(0);
  const [modelGroups, setModelGroups] = useState([]);
  const [sphereType, setSphereType] = useState('low');
  const [openModal, setOpenModal] = useState(false);
  const [openZoomModal, setOpenZoomModal] = useState(false);
  const [beadDetails, setBeadDetails] = useState({ solid: [], low: [], spike: [] });
  const [screenshot, setScreenshot] = useState(null);
  const [beadData, setBeadData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add cart store to access addToCart function
  const { addToCart } = useCartStore();

  const baseRadius = 0.2;

  // Type mapping
  const typeMap = {
    'low': 0,
    'spike': 1,
    'solid': 2
  };

  // Fetch bead data on component mount
  useEffect(() => {
    const getBeads = async () => {
      try {
        const data = await fetchBeads();
        console.log("Fetched bead data:", data);
        setBeadData(data);
      } catch (error) {
        console.error("Error fetching beads:", error);
        toast.error("Failed to load bead information");
      }
    };
    
    getBeads();
  }, []);

  // Calculate the radius based on numberOfModels
  const radius = baseRadius + numberOfModels * 0.18;

  // Scene setup
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      20,
      700 / 550,
      0.5,
      1000
    );
    camera.position.set(40, 35, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(700, 550);
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
        let geometry;

        switch (group.type) {
          case 'solid':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
          case 'low':
            geometry = new THREE.OctahedronGeometry(0.6, 1);
            break;
          case 'spike':
            geometry = new THREE.SphereGeometry(0.5, 64, 64);
            // Add spiky effect
            const position = geometry.attributes.position;
            for (let i = 0; i < position.count; i++) {
              const v = new THREE.Vector3().fromBufferAttribute(position, i);
              const originalLength = v.length();
              v.normalize().multiplyScalar(originalLength * (1 + Math.random() * 0.3));
              position.setXYZ(i, v.x, v.y, v.z);
            }
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
            break;
          default:
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        }

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
          flatShading: group.type === 'low'  // Enable flat shading for low-poly
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
      const pointLight = new THREE.PointLight(light.color, 200, 200);
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

  const getBeadIdByType = (type) => {
    const typeNum = typeMap[type];
    const bead = beadData.find(b => b.type === typeNum);
    return bead ? bead._id : null;
  };

  const getPriceForType = (type) => {
    const typeNum = typeMap[type];
    const bead = beadData.find(b => b.type === typeNum);
    return bead ? parseFloat(bead.price) : 0;
  };

  const getTotalForItem = (type, quantity) => {
    const price = getPriceForType(type);
    return price * quantity;
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
 
    Object.keys(beadDetails).forEach(type => {
      beadDetails[type].forEach(bead => {
        total += getTotalForItem(type, bead.quantity);
      });
    });
    
    return total.toFixed(2);
  };

  const handleAddModels = (color, count) => {
    const newTotal = numberOfModels + count;

    if (newTotal <= 120) {
      setNumberOfModels(prev => prev + count);
      setModelGroups(prev => [...prev, { color, count, type: sphereType }]);

      // Update bead details
      setBeadDetails(prev => {
        const updatedDetails = { ...prev };
        const beadType = sphereType;

        // Check if the bead already exists
        const existingBeadIndex = updatedDetails[beadType].findIndex(bead => bead.color === color);

        if (existingBeadIndex !== -1) {
          // If it exists, increase the quantity
          updatedDetails[beadType][existingBeadIndex].quantity += count;
        } else {
          // If it doesn't exist, add a new entry
          updatedDetails[beadType].push({ color, quantity: count });
        }

        return updatedDetails;
      });
    } else {
      alert('You can create a maximum of 120 models!');
    }
  };

  const handleRemoveAll = () => {
    setNumberOfModels(0);
    setModelGroups([]);
    setBeadDetails({ solid: [], low: [], spike: [] }); 
  };

  const handleRemoveLast = () => {
    if (modelGroups.length > 0) {
      const lastGroup = modelGroups[modelGroups.length - 1];
      setNumberOfModels(prev => Math.max(0, prev - lastGroup.count));
      setModelGroups(prev => prev.slice(0, -1));

      // Update bead details to remove the last added bead
      setBeadDetails(prev => {
        const updatedDetails = { ...prev };
        const beadType = lastGroup.type; // Get the type of the last added bead
        const existingBeadIndex = updatedDetails[beadType].findIndex(bead => bead.color === lastGroup.color);

        if (existingBeadIndex !== -1) {
          // Decrease the quantity or remove if it reaches zero
          updatedDetails[beadType][existingBeadIndex].quantity -= lastGroup.count;
          if (updatedDetails[beadType][existingBeadIndex].quantity <= 0) {
            updatedDetails[beadType].splice(existingBeadIndex, 1); // Remove bead if quantity is zero
          }
        }

        return updatedDetails;
      });
    }
  };

  const handlePreview = () => {
    // Capture the screenshot of the 3D scene
    html2canvas(containerRef.current, { backgroundColor: null, width: 700, height: 600 }).then(canvas => {
      setScreenshot(canvas.toDataURL("image/png"));
    });
    setOpenModal(true);
  };

  const handleAddToCart = async () => {
    if (numberOfModels < 10) {
      toast.error("Please add at least 10 beads to your accessory");
      return;
    }

    setIsSubmitting(true);

    try {
      const customItems = [];
      
      Object.keys(beadDetails).forEach(type => {
        beadDetails[type].forEach(bead => {
          const beadId = getBeadIdByType(type);
          if (beadId) {
            customItems.push({
              quantity: bead.quantity,
              color: bead.color,
              beadId: beadId
            });
          }
        });
      });

      let imageUrl = "default_image";
      
      if (screenshot) {
        // Convert base64 data URL to a Blob
        const response = await fetch(screenshot);
        const blob = await response.blob();
        
        // Create a File object from the Blob
        const imageFile = new File([blob], "custom_accessory.png", { type: "image/png" });
        
        const uploadResponse = await uploadImage(imageFile);
        imageUrl = uploadResponse.result
      }

      const requestData = {
        customItems: customItems,
        image: imageUrl
      };

      const response = await createCustomAccessory(requestData);
      
      const productId = response.productId;
      
      if (!productId) {
        throw new Error("Invalid response: No product ID returned");
      }
      
      const product = { _id: productId };
      await addToCart(product, 1); 
      
      toast.success("Custom accessory added to cart successfully!");
      setOpenModal(false);
      handleRemoveAll(); 
    } catch (error) {
      console.error("Error creating/adding custom accessory:", error);
      toast.error("Failed to add custom accessory to cart. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Grid container data-aos="fade-up" sx={{ mt: 5 }}>
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

          <BeadInfo />

          <ButtonCus 
            variant="button-02" 
            width="250px" 
            onClick={handlePreview} 
            sx={{ display: 'flex', justifyContent: 'center' }}
            disabled={numberOfModels === 0}
          > 
            Preview
          </ButtonCus>

        </Grid>
        <Grid item xs={6}>
          <div
            ref={containerRef}
            style={{
              width: "700px",
              height: "550px",
              overflow: "hidden",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        </Grid>
        <Grid item xs={3} sx={{ mt: 4 }}>
          <GlassCard>
            <CustomBoard
              onAddModels={handleAddModels}
              onRemoveAll={handleRemoveAll}
              onRemoveLast={handleRemoveLast}
              isLoading={isLoading}
              onTypeChange={(type) => setSphereType(type)}
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

      {/* Modal for Preview */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        sx={{ '& .MuiDialog-paper': { backgroundColor: 'black', border: '2px solid white' } }}
      >
        <DialogTitle sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Accessory Information</DialogTitle>
        <DialogContent>
        
          {screenshot && (
            <Box 
              sx={{ 
                cursor: 'zoom-in', 
                width: '100%', 
                marginBottom: '16px',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => setOpenZoomModal(true)}
            >
              <img 
                src={screenshot} 
                alt="3D Scene Screenshot" 
                style={{ width: '100%' }} 
              />
            </Box>
          )}
          
          {/* Table for Bead Information */}
          <TableContainer>
            <Table sx={{ minWidth: 500 }} aria-label="bead information table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white' }}>Color</TableCell>
                  <TableCell sx={{ color: 'white' }}>Quantity</TableCell>
                  <TableCell sx={{ color: 'white' }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beadDetails.solid.map((bead, index) => (
                  <TableRow key={`solid-${index}`}>
                    <TableCell sx={{ color: 'white' }}>Solid</TableCell>
                    <TableCell sx={{ color: bead.color }}>{bead.color}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{bead.quantity}</TableCell>
                    <TableCell sx={{ color: 'white' }}>${getTotalForItem('solid', bead.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {beadDetails.low.map((bead, index) => (
                  <TableRow key={`low-${index}`}>
                    <TableCell sx={{ color: 'white' }}>Low-Poly</TableCell>
                    <TableCell sx={{ color: bead.color }}>{bead.color}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{bead.quantity}</TableCell>
                    <TableCell sx={{ color: 'white' }}>${getTotalForItem('low', bead.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {beadDetails.spike.map((bead, index) => (
                  <TableRow key={`spike-${index}`}>
                    <TableCell sx={{ color: 'white' }}>Spike</TableCell>
                    <TableCell sx={{ color: bead.color }}>{bead.color}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{bead.quantity}</TableCell>
                    <TableCell sx={{ color: 'white' }}>${getTotalForItem('spike', bead.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>
                    Total:
                  </TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                    ${calculateTotalPrice()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <ButtonCus 
            variant="button-pixel-green" 
            height={40} 
            onClick={handleAddToCart} 
            disabled={isSubmitting || numberOfModels === 0}
            sx={{ color: 'white' }}
          >
            <Typography fontFamily="'Jersey 15', sans-serif" variant="h6" sx={{ color: "white" }}>
              {isSubmitting ? "Adding..." : "Add to cart"}
            </Typography>
          </ButtonCus>
        </DialogActions>
      </Dialog>

      {/* New Zoom Modal */}
      <Dialog 
        open={openZoomModal} 
        onClose={() => setOpenZoomModal(false)}
        maxWidth="xl"
        sx={{ 
          '& .MuiDialog-paper': { 
            backgroundColor: 'rgba(0, 0, 0, 0.9)', 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            overflow: 'hidden'
          } 
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton 
            onClick={() => setOpenZoomModal(false)}
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {screenshot && (
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                overflow: 'auto'
              }}
            >
              <img 
                src={screenshot} 
                alt="Zoomed 3D Scene" 
                style={{ 
                  maxWidth: '100vw',
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThreeCustom;