import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { fetchBeads, updateBeadPrice as updateBeadPriceApi } from '../../../../services/accessoryApi';

export default function SettingBeads() {
  const [beads, setBeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [prices, setPrices] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const loadBeads = async () => {
      try {
        setLoading(true);
        const data = await fetchBeads();
        console.log('Loaded beads:', data);
        setBeads(data);
        
        // Initialize price state
        const initialPrices = {};
        data.forEach(bead => {
          initialPrices[bead._id] = bead.price;
        });
        setPrices(initialPrices);
      } catch (error) {
        console.error('Failed to load beads:', error);
        setAlert({
          open: true,
          message: 'Failed to load beads. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadBeads();
  }, []);

  const handlePriceChange = (id, value) => {
    setPrices(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUpdateBeadPrice = async (beadId, price) => {
    try {
      setUpdating(prev => ({ ...prev, [beadId]: true }));
      
      const response = await updateBeadPriceApi(beadId, Number(price));
      
      setBeads(prev => 
        prev.map(bead => 
          bead._id === beadId ? { ...bead, price: Number(price) } : bead
        )
      );
      
      setAlert({
        open: true,
        message: 'Bead price updated successfully!',
        type: 'success'
      });
      
      return response;
    } catch (error) {
      console.error('Error updating bead price:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to update bead price',
        type: 'error'
      });
      throw error;
    } finally {
      setUpdating(prev => ({ ...prev, [beadId]: false }));
    }
  };

  const handleSubmit = async (id) => {
    if (!prices[id]) return;
    
    try {
      await handleUpdateBeadPrice(id, prices[id]);
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const getBeadTypeName = (type) => {
    switch (Number(type)) {
      case 0: return 'Low-poly';
      case 1: return 'Spike';
      case 2: return 'Solid';
      default: return 'Unknown';
    }
  };

  const getBeadImage = (type) => {
    switch (Number(type)) {
      case 0: return '/assets/beads/low-poly.png'; // Add appropriate paths
      case 1: return '/assets/beads/spike.png';
      case 2: return '/assets/beads/solid.png';
      default: return '/assets/beads/default.png';
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Bead Price Settings
      </Typography>
      
      <Grid container spacing={4}>
        {beads.map(bead => (
          <Grid item xs={12} md={4} key={bead._id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
          
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {getBeadTypeName(bead.type)} Bead
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Current Price:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${Number(bead.price).toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    label="New Price"
                    type="number"
                    value={prices[bead._id] || ''}
                    onChange={(e) => handlePriceChange(bead._id, e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    variant="outlined"
                    fullWidth
                    disabled={updating[bead._id]}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit(bead._id)}
                    disabled={updating[bead._id] || !prices[bead._id] || prices[bead._id] === bead.price}
                  >
                    {updating[bead._id] ? <CircularProgress size={24} /> : 'Update'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
