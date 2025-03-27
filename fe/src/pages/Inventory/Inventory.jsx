import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Grid, Card, CardContent, 
  CardMedia, IconButton, Dialog, CircularProgress, Chip, 
  Select, MenuItem, FormControl, InputLabel, Pagination, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SellIcon from '@mui/icons-material/Sell';
import GlassCard from '../../components/Decor/GlassCard';
import ButtonCus from "../../components/Button/ButtonCus";
import { fetchOpenItemData } from '../../services/productApi';
import { toast } from 'react-toastify';
import CreateOpenItemDialog from './CreateOpenItemDialog';

const ITEMS_PER_PAGE = 8;
const CONDITION_LABELS = {
  1: { label: 'Poor', color: '#F44336' },
  2: { label: 'Fair', color: '#FF9800' },
  3: { label: 'Good', color: '#FFC107' },
  4: { label: 'Very Good', color: '#8BC34A' },
  5: { label: 'Excellent', color: '#4CAF50' }
};

export default function Inventory() {
  const [openItems, setOpenItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [brandFilter, setBrandFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');

  // Fetch open items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetchOpenItemData();
      setOpenItems(response.result || []);
      setFilteredItems(response.result || []);
    } catch (error) {
      toast.error('Failed to fetch inventory items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search query, brand, and condition
  useEffect(() => {
    let result = [...openItems];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query)
      );
    }
    
    // Apply brand filter
    if (brandFilter !== 'all') {
      result = result.filter(item => item.brand === brandFilter);
    }
    
    // Apply condition filter
    if (conditionFilter !== 'all') {
      result = result.filter(item => Number(item.condition) === Number(conditionFilter));
    }
    
    setFilteredItems(result);
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, openItems, brandFilter, conditionFilter]);

  // Get unique brands for filter
  const uniqueBrands = [...new Set(openItems.map(item => item.brand))];

  // Handle successful item creation
  const handleItemCreated = () => {
    fetchItems();
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const displayedItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
        alignItems: 'center'
      }}>
        <GlassCard style={{ width: '95%', padding: '30px' }}>
          {/* Header with title and add button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: "'Jersey 15', sans-serif", 
                color: 'whitesmoke',
                textShadow: '0 0 5px rgba(255,215,0,0.7)'
              }}
            >
              My Inventory 🎮
            </Typography>
            <ButtonCus
              variant="button-pixel-green"
              width="180px"
              height="45px"
              onClick={() => setOpenDialog(true)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon />
                <Typography fontFamily="'Jersey 15', sans-serif" color="white">
                  Add Item
                </Typography>
              </Box>
            </ButtonCus>
          </Box>

          {/* Filters */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2, 
            mb: 3,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Search */}
            <TextField
              placeholder="Search items..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                sx: { 
                  color: 'white', 
                  minWidth: '300px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Brand filter */}
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="brand-filter-label" sx={{ color: 'white' }}>Brand</InputLabel>
                <Select
                  labelId="brand-filter-label"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  label="Brand"
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                      }
                    }
                  }}
                >
                  <MenuItem value="all">All Brands</MenuItem>
                  {uniqueBrands.map(brand => (
                    <MenuItem key={brand} value={brand} sx={{ color: 'white' }}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Condition filter */}
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="condition-filter-label" sx={{ color: 'white' }}>Condition</InputLabel>
                <Select
                  labelId="condition-filter-label"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  label="Condition"
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                      }
                    }
                  }}
                >
                  <MenuItem value="all">All Conditions</MenuItem>
                  {Object.entries(CONDITION_LABELS).map(([value, { label }]) => (
                    <MenuItem key={value} value={value} sx={{ color: 'white' }}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#FFD700' }} />
            </Box>
          )}

          {/* No items message */}
          {!loading && filteredItems.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              border: '1px dashed rgba(255, 255, 255, 0.3)'
            }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                No items found. Add some items to your inventory!
              </Typography>
            </Box>
          )}

          {/* Items grid */}
          {!loading && filteredItems.length > 0 && (
            <Grid container spacing={3}>
              {displayedItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: 'contain', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                      />
                      <Chip
                        label={item.condition && CONDITION_LABELS[item.condition] 
                          ? `${CONDITION_LABELS[item.condition].label} Condition` 
                          : `Category: ${item.category || 'Unknown'}`}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: item.condition && CONDITION_LABELS[item.condition] 
                            ? CONDITION_LABELS[item.condition].color 
                            : '#2196F3',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, flexGrow: 1 }}>
                        {item.description.length > 100 
                          ? `${item.description.substring(0, 100)}...` 
                          : item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Brand: {item.brand}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          ${parseFloat(item.price).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <IconButton 
                          sx={{ color: '#2196F3', border: '1px solid rgba(33, 150, 243, 0.3)' }}
                          title="Edit Item"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          sx={{ color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.3)' }}
                          title="Delete Item"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton 
                          sx={{ color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.3)' }}
                          title="Sell Item"
                        >
                          <SellIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: 'rgba(255, 215, 0, 0.3)',
                    borderColor: '#FFD700',
                    color: '#FFD700'
                  }
                }}
              />
            </Box>
          )}
        </GlassCard>
      </Box>

      {/* Create Item Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: 2,
            width: '100%'
          }
        }}
      >
        <CreateOpenItemDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={handleItemCreated}
        />
      </Dialog>
    </>
  );
}