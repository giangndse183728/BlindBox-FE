import React, { useState } from "react";
import { GithubPicker } from "react-color";
import { Box, Button, TextField, Select, MenuItem, Grid, Slider, Typography } from "@mui/material";
import ToggleEngine from "./ToggleButton";
import GlassCard from "../../components/Decor/GlassCard";

// BeadInfo Component
const BeadInfo = () => {
  return (
    <Typography 
      variant="subtitle1" 
      sx={{ mt: 2, mb: 3, ml: 6, color: "white" }} 
      data-aos="fade-up" 
      data-aos-delay="200"
    >
      <GlassCard>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily:"'Jersey 15', sans-serif" }}>
          🔹 Bead Recommendations:
        </Typography>
        <br />
        • <strong>Keychain:</strong> 20–30 beads <br />
        • <strong>Strap:</strong> 30–60 beads <br />
        • <strong>Cross-Strap:</strong> 60–120 beads <br />
      </GlassCard>

      <br />

      <GlassCard>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily:"'Jersey 15', sans-serif" }}>
          💎 Bead Pricing:
        </Typography>
        <br />
        • <strong>Solid Beads:</strong> $0.2 each <br />
        • <strong>Low-Poly Beads:</strong> $0.5 each <br />
        • <strong>Spike Beads:</strong> $1 each <br />
      </GlassCard>
    </Typography>
  );
};

// CustomBoard Component
const CustomBoard = ({ onAddModels, onRemoveAll, isLoading }) => {
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
    <GlassCard> {/* Wrap entire section in GlassCard */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", p: 2 }}>
        
        <Grid container>
          <Grid item xs={8} container justifyContent="center">
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
                { value: 30, label: "30" },
                { value: 60, label: "60" },
                { value: 100, label: "100" },
              ]}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              sx={{
                color: color,
                width: "15px",
                "& .MuiSlider-thumb": {
                  backgroundColor: color,
                },
                "& .MuiSlider-markLabel": {
                  color: "white",
                },
              }}
            />
          </Grid>
        </Grid>

        <ToggleEngine />

        <Typography variant="caption" sx={{ color: "white", textAlign: "center" }}>
          *Please note that the 3D model display is not 100% realistic and may vary in appearance.
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddModels}
          disabled={isLoading}
          sx={{
            bgcolor: color,
            "&:hover": {
              bgcolor: color,
              filter: "brightness(0.9)",
            },
          }}
        >
          {isLoading ? "Loading..." : "Add Models"}
        </Button>
      </Box>
    </GlassCard>
  );
};

export { BeadInfo, CustomBoard }; // Export both components
