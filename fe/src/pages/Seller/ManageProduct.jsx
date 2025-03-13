import React, { useState, useEffect } from 'react';
import { 
  Box, Typography,
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, CircularProgress, Slider
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { fetchSellerBlindboxData } from '../../services/productApi';
import GlassCard from "../../components/Decor/GlassCard"
import ButtonCus from '../../components/Button/ButtonCus';
import CreateBlindboxDialog from './CreateBlindboxDialog';

export default function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchSellerBlindboxData();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  

  return (
    <>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -2,
      }}/>
      
      <Box sx={{ 
        padding: 4, 
        marginTop: '60px', 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 'calc(100vh - 60px)',
        alignItems:'center'
      }}>
        <GlassCard style={{width:'90%', padding:'30px'}}>
        
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color:'whitesmoke' }}>
              Manage BlindBox 📦  
            </Typography>
            <ButtonCus
                variant="button-pixel-yellow"
                width="100%"
                height="40px"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                 <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif" }}> Create BlindBox </Typography> 
                </ButtonCus>
       
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#FFD700' }} />
            </Box>
          ) : products.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              No products found. Create your first product!
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Image</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Brand</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Price</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Quantity</TableCell>
                    <TableCell sx={{ color: '#FFD700', fontFamily: "'Jersey 15', sans-serif" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box 
                          component="img" 
                          src={product.image} 
                          alt={product.name}
                          sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{product.name}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{product.brand}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{product.price}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{product.quantity}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        
        </GlassCard>
      </Box>

      {/* Use the separated dialog component */}
      <CreateBlindboxDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        onSuccess={fetchProducts} 
      />
    </>
  );
}