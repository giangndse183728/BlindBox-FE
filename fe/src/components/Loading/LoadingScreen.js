import React from 'react';
import { Box, Typography } from '@mui/material';
import './LoadingScreen.css'; // Import the CSS file

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111111',
        zIndex: 9999,
      }}
    >
      <img
        src="/assets/logoBB.png"
        alt="BlindB!ox"
        className="rotating-logo"
        style={{
          width: 100,
          height: 100,
          marginBottom: 20
        }}
      />
  
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontFamily: 'Yusei Magic',
        }}
      >
        Loading BlindBoxx...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;