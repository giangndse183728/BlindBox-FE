import React, { useState } from "react";
import { GithubPicker } from "react-color";
import { Box, Button, Grid, Slider, Typography, IconButton } from "@mui/material";
import ToggleEngine from "./ToggleButton";
import GlassCard from "../../components/Decor/GlassCard";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


const BeadInfo = () => {
  return (
    <Typography 
      variant="subtitle1" 
      sx={{ mt: 2, mb: 3, ml: 6, color: "white" }} 
      data-aos="fade-up" 
      data-aos-delay="200"
    >
      <GlassCard>
        <Typography 
          variant="h5" 
          sx={{ fontFamily: "'Jersey 15', sans-serif", color: "white", mb:2  }}
        >
          🔹 Bead Recommendations:
        </Typography>
        
        <Typography sx={{ color: "white" }}>
          • <strong>Keychain:</strong> 20–30 beads <br />
          • <strong>Strap:</strong> 30–60 beads <br />
          • <strong>Cross-Strap:</strong> 60–120 beads <br />
        </Typography>
      </GlassCard>

      <br />

      <GlassCard>
        <Typography 
          variant="h5" 
          sx={{  fontFamily: "'Jersey 15', sans-serif", color: "white", mb:2 }}
        >
          💲 Bead Pricing:
        </Typography>

        <Typography sx={{ color: "white" }}>
          • <strong>Solid Beads:</strong> $0.2 each <br />
          • <strong>Low-Poly Beads:</strong> $0.5 each <br />
          • <strong>Spike Beads:</strong> $1 each <br />
        </Typography>
      </GlassCard>
    </Typography>
  );
};



// CustomBoard Component
const CustomBoard = ({ onAddModels, onRemoveAll, onRemoveLast, isLoading, onTypeChange }) => {
  const [color, setColor] = useState("#fff");
  const [numberOfModels, setNumberOfModels] = useState(5);

  const valuetext = (value) => `${value} Models`;

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const handleAddModels = () => {
    onAddModels(color, numberOfModels);
  };

  return (
    <div style={{ padding: "20px" }}>
     
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
    <Grid container >
    <Grid item xs={8} container justifyContent="center" >
      <GithubPicker 
        color={color} 
        onChange={handleColorChange} 
        width="52px"
        colors={[
          '#B80000', '#DB3E00', '#FCCB00', '#008B02',
          '#006B76', '#1273DE', '#004DCF', '#5300EB',
          '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5',
          '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'
        ]}
      />

      </Grid>
      <Grid item xs={4} justifyContent="center">
    
      <Slider 
      value={numberOfModels}
      onChange={(e, newValue) => setNumberOfModels(newValue)}
      orientation="vertical"
      min={1}
      max={120}
      step={1} // Step of 1 for fine control
      marks={[
        { value: 30, label: '30' },
        { value: 60, label: '60' },
        { value: 100, label: '100' },
      ]}
      valueLabelDisplay="auto"
      getAriaValueText={valuetext}
      sx={{
        color: color, 
        width: '15px',
        '& .MuiSlider-thumb': { 
          backgroundColor: color,
        },
        '& .MuiSlider-markLabel': {
          color: 'white', 
        },
      }}
    />

    </Grid>
    </Grid>
    <ToggleEngine onChange={onTypeChange}/>
   
    <Typography variant="caption" sx={{ color: 'white', textAlign: 'center'}}>
*Please note that the 3D model display is not 100% realistic and may vary in appearance.
</Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleAddModels}
          disabled={isLoading}
          sx={{ 
            bgcolor: color,
            '&:hover': {
              bgcolor: color,
              filter: 'brightness(0.9)'
            }
          }}
        >
          {isLoading ? 'Loading...' : 'Add Models'}
        </Button>

        <IconButton
          variant="contained"
          onClick={onRemoveLast}
          disabled={isLoading}
          sx={{
            bgcolor: '#ff4444',
            '&:hover': {
              bgcolor: '#ff4444',
              filter: 'brightness(0.9)'
            }
          }}
        >
          <RemoveCircleOutlineIcon/>
        </IconButton>
      </Box>

    </Box>
  </div>

  );
};

export { BeadInfo, CustomBoard }; // Export both components
