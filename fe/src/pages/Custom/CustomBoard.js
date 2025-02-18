import React, { useState } from "react";
import { GithubPicker } from "react-color";
import { Box, Button, TextField, Select, MenuItem, Grid } from "@mui/material";
import { Slider, Typography } from "@mui/material";
import ToggleEngine from "./ToggleButton";



const CustomBoard = ({ onAddModels, onRemoveAll, isLoading }) => {


  const valuetext = (value) => `${value} Models`;
  const [color, setColor] = useState("#fff");
  const [numberOfModels, setNumberOfModels] = useState(5);

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
        min={20}
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
      <ToggleEngine/>
     
      <Typography variant="caption" sx={{ color: 'white', textAlign: 'center'}}>
  *Please note that the 3D model display is not 100% realistic and may vary in appearance.
</Typography>

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

      </Box>
    </div>
  );
};

export default React.memo(CustomBoard);
