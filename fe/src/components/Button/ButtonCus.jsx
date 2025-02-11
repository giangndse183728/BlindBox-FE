import React from 'react';
import './ButtonCus.css'; 
import { Box } from '@mui/material';

const ButtonCus = ({ children, onClick, sx, width = '200px', variant = 'button-85' }) => {
  return (
    <Box sx={sx}>  
      <button 
        className={variant} 
        role="button" 
        onClick={onClick} 
        style={{ width }}
      >
        {children}
      </button>
    </Box>
  );
};

export default ButtonCus;