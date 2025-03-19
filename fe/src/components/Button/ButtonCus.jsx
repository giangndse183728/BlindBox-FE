import React from 'react';
import './ButtonCus.css'; 
import { Box } from '@mui/material';

const ButtonCus = ({ 
  children, 
  onClick, 
  sx, 
  width = '200px',
  height, 
  variant = 'button-85',
  startIcon
}) => {
  return (
    <Box sx={sx}>  
      <button 
        className={variant} 
        role="button" 
        onClick={onClick} 
        style={{ width, height }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          {startIcon && startIcon}
          {children}
        </Box>
      </button>
    </Box>
  );
};

export default ButtonCus;