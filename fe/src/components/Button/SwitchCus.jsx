import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import './SwitchCus.css'; // Import the CSS file


const SwitchCus = ({ 
  checked = false, 
  onChange, 
  label = '', 
  labelPlacement = 'end',
  sx = {},
  ...props 
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  // The switch component using the CSS classes from the provided file
  const switchComponent = (
    <div className="toggle-container" style={sx}>
      <input 
        className="toggle-input" 
        type="checkbox" 
        checked={checked} 
        onChange={handleChange}
        {...props}
      />
      <div className="toggle-handle-wrapper">
        <div className="toggle-handle">
          <div className="toggle-handle-knob"></div>
          <div className="toggle-handle-bar-wrapper">
            <div className="toggle-handle-bar"></div>
          </div>
        </div>
      </div>
      <div className="toggle-base">
        <div className="toggle-base-inside"></div>
      </div>
    </div>
  );

  // If there's a label, wrap the switch in a FormControlLabel
  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={label}
        labelPlacement={labelPlacement}
      />
    );
  }

  return switchComponent;
};

export default SwitchCus;
