import React from 'react'
import { Typography } from '@mui/material'
import { yellowGlowAnimation } from './YellowEffect'

const BigText = ({ text }) => {
  return (
    <Typography
      variant="h1"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' },
        color: 'white',
        textAlign: 'center',
        zIndex: 10,
        fontFamily: '"Jersey 15", sans-serif',
        ...yellowGlowAnimation
      }}
    >
      {text}
    </Typography>
  )
}

export default BigText
