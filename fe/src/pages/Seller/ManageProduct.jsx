import React, { useState, useEffect } from 'react';
import { 
  Box, Typography,
  Paper, CircularProgress, 
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Pagination, Tabs, Tab, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, DialogContentText, Grid, Card, CardMedia, 
  CardContent, Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';
import { fetchSellerBlindboxData, updateBlindbox, deleteBlindbox } from '../../services/productApi';
import GlassCard from "../../components/Decor/GlassCard"
import ButtonCus from '../../components/Button/ButtonCus';
import CreateBlindboxDialog from './CreateBlindboxDialog';
import ActionMenu from "../../components/Button/ActionMenu";
import ManageSellerOrders from './ManageSellerOrders';

export default function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8); // Increased for card layout
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters whenever products, search query, or status filter changes
    filterProducts();
  }, [products, searchQuery, statusFilter]);

  useEffect(() => {
    // Update displayed products when filtered products or pagination changes
    updateDisplayedProducts();
  }, [filteredProducts, page, itemsPerPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchSellerBlindboxData();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const statusValue = statusFilter === 'approved' ? 1 : 0;
      filtered = filtered.filter(product => product.status === statusValue);
    }
    
    setFilteredProducts(filtered);
    
    // Reset to first page when filters change
    setPage(1);
    
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
  };
  
  const updateDisplayedProducts = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      await updateBlindbox(productId, updatedData);
      toast.success('Product updated successfully');
      fetchProducts(); // Refresh the product list
      handleCloseEditDialog();
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      await deleteBlindbox(selectedProduct._id);
      toast.success('Product deleted successfully');
      fetchProducts(); // Refresh the product list
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };



  // Function to get status color
  const getStatusColor = (status) => {
    return status === 1 ? '#4CAF50' : '#FF9800';
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
        {/* Tabs for switching between products and orders */}
        <Box sx={{ 
          width: '90%', 
          mb: 2, 
          borderBottom: 1, 
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              '& .MuiTabs-indicator': { 
                backgroundColor: '#FFD700' 
              },
            }}
          >
            <Tab 
              label="My Products" 
              sx={{ 
                color: 'white', 
                '&.Mui-selected': { color: '#FFD700' },
                fontFamily: "'Jersey 15', sans-serif"
              }} 
            />
            <Tab 
              label="My Orders" 
              sx={{ 
                color: 'white', 
                '&.Mui-selected': { color: '#FFD700' },
                fontFamily: "'Jersey 15', sans-serif"
              }} 
            />
          </Tabs>
        </Box>
        
        {/* Products Tab */}
        {tabValue === 0 && (
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
            
            {/* Search and Filter Controls */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3,
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
            }}>
              <TextField
                placeholder="Search by product name"
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }
                }}
              />
              
              <FormControl 
                variant="outlined" 
                sx={{ 
                  minWidth: 180,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                }}
              >
                <InputLabel 
                  id="status-filter-label" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': { color: '#FFD700' }
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                  IconComponent={FilterListIcon}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                {products.length === 0 ? 
                  "No products found. Create your first product!" : 
                  "No matching products found for your search criteria."}
              </Typography>
            ) : (
              <>
                {/* Card Grid Layout */}
                <Grid container spacing={3}>
                  {displayedProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.3)'
                        }
                      }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.image}
                            alt={product.name}
                            sx={{ objectFit: 'contain'}}
                          />
                          <Chip
                            label={product.status === 1 ? 'Approved' : 'Pending'}
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              backgroundColor: getStatusColor(product.status),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, flexGrow: 1 }}>
                            {product.description.length > 100 
                              ? `${product.description.substring(0, 100)}...` 
                              : product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Brand: {product.brand}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Qty: {product.quantity}
                              </Typography>
                              {product.size && (
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  Size: {product.size}cm
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                              ${parseFloat(product.price).toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <ActionMenu 
                              onEdit={() => handleEditProduct(product)}
                              onDelete={() => handleDeleteProduct(product)}
                              direction="horizontal"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination Controls */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 3,
                  px: 1
                }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Showing {displayedProducts.length} of {filteredProducts.length} products
                  </Typography>
                  
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'white',
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        borderColor: '#FFD700',
                      },
                      '& .MuiPaginationItem-page:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </GlassCard>
        )}
        
        {/* Orders Tab */}
        {tabValue === 1 && (
          <Box sx={{ width: '90%' }}>
            <ManageSellerOrders />
          </Box>
        )}
      </Box>

      {/* Add Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '8px',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            sx={{ 
              backgroundColor: '#FF4444', 
              color: 'white',
              '&:hover': { backgroundColor: '#CC0000' }
            }}
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add the CreateBlindboxDialog but modified to handle editing as well */}
      <CreateBlindboxDialog 
        open={openDialog || openEditDialog} 
        onClose={openEditDialog ? handleCloseEditDialog : handleCloseDialog}
        onSuccess={fetchProducts}
        isEditing={openEditDialog}
        productData={selectedProduct}
        handleUpdate={handleUpdateProduct}
      />
    </>
  );
}