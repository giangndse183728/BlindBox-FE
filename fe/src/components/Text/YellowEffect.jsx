export const yellowGlowAnimation = {
    textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
    animation: 'flicker 1s linear infinite',
    '@keyframes flicker': {
          '0%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '18%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '20%': {
            textShadow: 'none',
          },
          '21%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '23%': {
            textShadow: 'none',
          },
          '25%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '35%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '39%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '40%': {
            textShadow: 'none',
          },
          '41%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
          '100%': {
            textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
          },
        }
  }