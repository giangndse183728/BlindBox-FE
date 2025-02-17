import React from 'react'
import { Button, Grid, Typography, Card, CardMedia, CardContent, Box, Paper, TextField, Link} from '@mui/material';
import Footer from '../../layouts/Footer';

export default function ForgotPassword() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
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
      <Grid container data-aos="fade" data-aos-delay="200" sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        minHeight: 'auto',
        visibility: 'visible',
        opacity: 1,
        transition: 'opacity 0.3s ease-in-out',
        overflow: 'hidden',
      }}>
        <Grid
          item
          xs={12}
          component={Paper}
          elevation={12}
          square
          sx={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            px: 6,
            border: '1px solid rgba(128, 115, 1, 0.2)',
            boxShadow: `
              0 0 10px rgba(128, 115, 1, 0.1),
              0 0 20px rgba(128, 115, 1, 0.05),
              inset 0 0 20px rgba(128, 115, 1, 0.05)
            `,
            '@keyframes borderGlow': {
              '0%': {
                boxShadow: `
                  0 0 10px rgba(133, 98, 1, 0.1),
                  0 0 20px rgba(133, 98, 1, 0.05),
                  inset 0 0 20px rgba(133, 98, 1, 0.05)
                `
              },
              '50%': {
                boxShadow: `
                  0 0 15px rgba(189, 139, 2, 0.2),
                  0 0 30px rgba(189, 139, 2, 0.1),
                  inset 0 0 30px rgba(189, 139, 2, 0.1)
                `
              },
              '100%': {
                boxShadow: `
                  0 0 10px rgba(232, 213, 2, 0.1),
                  0 0 20px rgba(232, 213, 2, 0.05),
                  inset 0 0 20px rgba(232, 213, 2, 0.05)
                `
              }
            },
            animation: 'borderGlow 3s ease-in-out infinite',
          }}
        >
          <Box
            data-aos="fade-up"
            data-aos-delay="200"
            sx={{
              marginBottom: 2,
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/logoBB.png"
              width="80"
              height="80"
              alt="."
              data-aos="zoom-in"
              data-aos-delay="400"
            >
            </img>
            <Typography
              fontFamily="Yusei Magic"
              component="h1"
              variant="h5"
              sx={{ mt: 1, mb: 2, color: 'white' }}
              data-aos="fade-up"
              data-aos-delay="600"
            >
              BlindB!ox
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'white', mb: 3, textAlign: 'center' }}
              data-aos="fade-up"
              data-aos-delay="700"
            >
              Reset Password
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'white', mb: 2, textAlign: 'center' }}
              data-aos="fade-up"
              data-aos-delay="800"
            >
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: 'rgba(189, 139, 2, 0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(189, 139, 2, 0.9)',
                  },
                }}
                data-aos="fade-up"
                data-aos-delay="900"
              >
                Send Reset Link
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{
                      mb:5,
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    Back to Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Footer sx={{ flexShrink: 0 }} />
    </Box>
  )
}
