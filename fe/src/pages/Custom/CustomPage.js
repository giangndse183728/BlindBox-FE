import React, { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ThreeCustom from './ThreeCustom';

export default function CustomPage() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <Grid
        container
        component="main"
        sx={{
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative', // ensures the background is behind the content
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/background.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            zIndex: -2,
          }}
        />
        <ThreeCustom />
      </Grid>
    </>
  );
}
