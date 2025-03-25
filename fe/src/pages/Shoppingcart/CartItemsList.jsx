import React from "react";
import { 
  Box, Typography, Grid, TextField, Chip,
  Checkbox, FormControlLabel
} from "@mui/material";
import ButtonCus from "../../components/Button/ButtonCus";
import DeleteIconOutlined from '@mui/icons-material/DeleteOutlined';
import { Link } from "react-router-dom";

const CartItemsList = ({ 
  cartItems, 
  selectedItems,
  selectAll,
  quantityInputs,
  isLoading,
  handleItemSelect,
  handleSelectAll, 
  handleDeleteSelected,
  handleQuantityChange,
  handleQuantityInputChange,
  handleQuantityInputBlur,
  handleDelete,
  areAllItemsSelected
}) => {
  const isAccessory = (item) => {
    return item.product?.accessories && item.product.accessories.length > 0;
  };

  return (
    <Box sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 2,
      p: 3
    }}>
      {/* Add delete selected button and select all checkbox */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={selectAll}
              onChange={handleSelectAll}
              sx={{ 
                color: '#f8b400',
                '&.Mui-checked': {
                  color: '#f8b400',
                }
              }}
            />
          }
          label={
            <Typography 
              sx={{ 
                color: 'white', 
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: '1rem'
              }}
            >
              Select all
            </Typography>
          }
        />
        
        <ButtonCus
          variant="button-pixel-red"
          onClick={handleDeleteSelected}
          width="160px"
          height="30px"
          disabled={Object.keys(selectedItems).filter(id => selectedItems[id]).length === 0}
        >
          <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
            {areAllItemsSelected() ? "Clear Cart" : "Remove Selected"}
          </Typography>
        </ButtonCus>
      </Box>
      
      {/* Header Row */}
      <Grid container spacing={2} sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2 }}>
        <Grid item xs={1}>
          {/* Checkbox column */}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
            Product Name
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
            Brand
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
            Price
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
            Qty
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: 'center' }}>
          {/* Delete button column */}
        </Grid>
      </Grid>

      {cartItems.map((item) => (
        <Grid container spacing={2} key={item._id} sx={{
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          py: 2,
          bgcolor: selectedItems[item.product._id] ? 'rgba(248, 180, 0, 0.1)' : 'transparent',
        }}>
          {/* Checkbox column */}
          <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Checkbox 
              checked={!!selectedItems[item.product._id]}
              onChange={() => handleItemSelect(item.product._id)}
              sx={{ 
                color: '#f8b400',
                '&.Mui-checked': {
                  color: '#f8b400',
                }
              }}
            />
          </Grid>
          
          {/* Product info */}
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
            {isAccessory(item) ? (
              <Link 
                to={`/product/accessory/${item.product?.slug}?id=${item.product?._id}`} 
                style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  style={{ width: 80, height: 80, borderRadius: '10px', marginRight: '16px' }}
                />
                <Box>
                  <Typography sx={{ color: "white" }}>{item.product?.name}</Typography>
                  <Chip 
                    label="Custom Accessory" 
                    size="small"
                    sx={{ 
                      mt: 0.5,
                      bgcolor: 'rgba(255,215,0,0.1)',
                      color: '#FFD700',
                      border: '1px solid rgba(255,215,0,0.3)',
                      fontSize: '0.7rem'
                    }} 
                  />
                </Box>
              </Link>
            ) : (
              <Link 
                to={`/product/${item.product?.slug}?id=${item.product?._id}`} 
                style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  style={{ width: 80, height: 80, borderRadius: '10px', marginRight: '16px' }}
                />
                <Typography sx={{ color: "white" }}>{item.product?.name}</Typography>
              </Link>
            )}
          </Grid>
          
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: "white" }}>{item.product?.brand}</Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: "white" }}>${parseFloat(item.product?.price).toFixed(2) || "N/A"}</Typography>
          </Grid>
          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonCus
              variant="button-pixel"
              onClick={() => handleQuantityChange(item, item.cartQuantity - 1)}
              width="30px"
              height="30px"
              disabled={isLoading || item.cartQuantity <= 1}
            >
              -
            </ButtonCus>

            <Box sx={{ mx: 1, width: '50px' }}>
              <TextField
                value={quantityInputs[item.product._id] || item.cartQuantity.toString()}
                onChange={(e) => handleQuantityInputChange(item, e.target.value)}
                onBlur={() => handleQuantityInputBlur(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuantityInputBlur(item);
                    e.target.blur();
                  }
                }}
                inputProps={{
                  style: { 
                    textAlign: 'center',
                    padding: '0',
                    color: "white",
                    fontSize: '1rem',
                    fontFamily: "'Jersey 15', sans-serif"
                  },
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    height: '30px',
                    '& fieldset': {
                      borderColor: '#f8b400',
                      borderRadius: 1
                    },
                    '&:hover fieldset': {
                      borderColor: '#f8b400',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f8b400',
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    p: '5px',
                  }
                }}
              />
            </Box>

            {item.cartQuantity < item.product.quantity && (
              <ButtonCus
                variant="button-pixel"
                onClick={() => handleQuantityChange(item, item.cartQuantity + 1)}
                width="30px"
                height="30px"
                disabled={isLoading}
              >
                +
              </ButtonCus>
            )}
          </Grid>

          <Grid item xs={1} sx={{ textAlign: 'center' }}>
            <ButtonCus
              variant="button-pixel-red"
              onClick={() => handleDelete(item)}
              width="40px"
              height="40px"
              disabled={isLoading}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIconOutlined sx={{ fontSize: 20 }} />
              </Box>
            </ButtonCus>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default CartItemsList;
