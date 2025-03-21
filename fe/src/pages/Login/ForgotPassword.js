import React, { useState, useEffect } from 'react'
import { Button, Grid, Typography, Box, Paper, TextField, Link, CircularProgress, Alert } from '@mui/material';
import Footer from '../../layouts/Footer';
import { requestPasswordReset, resetPassword } from '../../services/userApi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in the URL
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsResetMode(true);
    }
  }, [location]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(password, confirmPassword, token);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      <Grid container  sx={{
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
           
            >
            </img>
            <Typography
              fontFamily="Yusei Magic"
              component="h1"
              variant="h5"
              sx={{ mt: 1, mb: 2, color: 'white' }}
           
            >
              BlindB!ox
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'white', mb: 3, textAlign: 'center' }}
        
            >
              {isResetMode ? 'Set New Password' : 'Reset Password'}
            </Typography>
            
            {success ? (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}>
                  {isResetMode 
                    ? 'Password reset successful!' 
                    : 'Reset link sent! Please check your email.'}
                </Alert>
                <Typography variant="body2" sx={{ color: 'white', mb: 3 }}>
                  {isResetMode
                    ? 'Your password has been reset successfully. You will be redirected to the login page shortly.'
                    : `A password reset link has been sent to ${email}. Please check your email and follow the instructions to reset your password.`}
                </Typography>
                <Link
                  href="/login"
                  variant="body2"
                  sx={{
                    mb: 5,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Box>
            ) : isResetMode ? (
              // Password Reset Form
              <>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 2, textAlign: 'center' }}
              
                >
                  Enter your new password below.
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#f44336' }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="New Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: 'rgba(189, 139, 2, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(189, 139, 2, 0.9)',
                      },
                    }}
                 
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                  </Button>
                </Box>
              </>
            ) : (
              // Request Reset Form
              <>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 2, textAlign: 'center' }}
             
                >
                  Enter your email address and we'll send you instructions to reset your password.
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#f44336' }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleRequestReset} noValidate sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: 'rgba(189, 139, 2, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(189, 139, 2, 0.9)',
                      },
                    }}
              
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                  </Button>
                </Box>
              </>
            )}
            
       
          </Box>
        </Grid>
      </Grid>
      <Footer sx={{ flexShrink: 0 }} />
    </Box>
  )
}
