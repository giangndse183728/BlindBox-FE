import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ButtonCus from '../../components/Button/ButtonCus';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import { fetchAccessoryById } from '../../services/accessoryApi';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled components
const GlassCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 215, 0, 0.3)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  color: 'white',
}));

const BeadChip = styled(Chip)(({ theme, color }) => ({
  backgroundColor: color === 'Red' ? 'rgba(255, 0, 0, 0.2)' : 
                  color === 'Green' ? 'rgba(0, 128, 0, 0.2)' : 
                  'rgba(0, 0, 0, 0.2)',
  color: color === 'Red' ? '#ff6666' : 
         color === 'Green' ? '#66cc66' : 
         'white',
  border: `1px solid ${color === 'Red' ? '#ff6666' : 
                       color === 'Green' ? '#66cc66' : 
                       'white'}`,
  margin: theme.spacing(0.5),
}));

const AccessoryDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAccessoryById(slug,id);
        setAccessory(response.result);
        setLoading(false);
      } catch (err) {
        setError("Failed to load accessory details. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <CircularProgress sx={{ color: 'gold' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!accessory) return null;

  const { product, beadDetails, summary } = accessory;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
    <Box sx={{
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
    }}/>
      {/* Back button */}
      <Box sx={{ mb: 2, mt: 12, ml:2, display: 'flex', justifyContent: 'flex-start' }}>
        <ButtonCus
          variant="button-pixel"
          width="160px"
          onClick={() => navigate('/cart')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back to Cart
          </Box>
        </ButtonCus>
      </Box>
      
      <Grid container spacing={4} justifyContent="center" p={2}>
        {/* Left Column - Image */}
        <Grid item xs={12} md={5}>
          <GlassCard elevation={0} sx={{ height: '100%' }}>
            <Box sx={{ 
              width: '100%', 
              height: '350px', 
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              mb: 2
            }}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Custom Accessory Preview
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                fontFamily="'Jersey 15', sans-serif"
                sx={{
                  color: "#FFD700",
                  mb: 2,
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  pb: 1
                }}
              >
                Beads Used
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {beadDetails.map((bead, index) => (
                  <BeadChip 
                    key={index}
                    label={`${bead.color} (${bead.quantity})`}
                    color={bead.color}
                  />
                ))}
              </Box>
              
              <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.4)', color: 'white' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Color</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {beadDetails.map((bead, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: 'white' }}>{bead.beadId.split('-').pop() || 'Custom'}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{bead.color}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{bead.quantity}</TableCell>
                        <TableCell sx={{ color: 'white' }}>${(bead.totalPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{summary.totalQuantity}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', color: '#FFD700' }}>
                        ${(summary.totalPrice ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={7}>
          <GlassCard elevation={0}>
            <Typography
              variant="h4"
              fontFamily="'Jersey 15', sans-serif"
              sx={{
                color: "white",
                ...yellowGlowAnimation,
                mb: 1
              }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography
                variant="h5"
                fontFamily="'Jersey 15', sans-serif"
                sx={{ color: '#FFD700' }}
              >
                ${(product.price ).toFixed(2)}
              </Typography>
              <Chip 
                label={`${summary.totalQuantity} Beads`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)'
                }} 
              />
              <Chip 
                label="Custom Design" 
                sx={{ 
                  bgcolor: 'rgba(255,215,0,0.1)',
                  color: '#FFD700',
                  border: '1px solid rgba(255,215,0,0.3)'
                }} 
              />
            </Box>
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
            
            <Typography
              variant="h6"
              fontFamily="'Jersey 15', sans-serif"
              sx={{
                color: "#FFD700",
                mb: 2
              }}
            >
              Product Description
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
              {product.description}
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.05)',
                p: 2,
                borderRadius: 2,
                mb: 3
              }}
            >
              <InfoIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                This is a custom designed accessory. Each piece is carefully crafted to match your specifications.
              </Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Created Date:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: 'white' }}>
                  {formatDate(product.createdAt)}
                </Typography>
              </Grid>
              
             
              
              <Grid item xs={6}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Available Quantity:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: 'white' }}>
                  {product.quantity > 0 ? product.quantity : 'Out of Stock'}
                </Typography>
              </Grid>
            </Grid>
          </GlassCard>
        </Grid>
      </Grid>
    </>
  );
};

export default AccessoryDetailPage;
