import React from "react";
import { 
  Box, Typography, Button, Grid, TextField, CircularProgress, 
  Dialog, DialogContent, DialogActions, FormControlLabel, Switch, Divider,
  Radio, RadioGroup, FormControl, IconButton
} from "@mui/material";
import ButtonCus from "../../components/Button/ButtonCus";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const OrderInfoDialog = ({ 
  open, 
  onClose, 
  orderInfo, 
  handleOrderInfoChange, 
  handleGiftToggle, 
  profileLoading, 
  profileError 
}) => {
  const paymentMethods = {
    cod: { name: 'Cash On Delivery', icon: <LocalShippingIcon />, value: 0 },
    banking: { name: 'Bank Transfer', icon: <AccountBalanceIcon />, value: 1 }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
          Order Information
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ p: 3, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
    
        
        {profileLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#FFD700' }} />
          </Box>
        ) : profileError ? (
          <Typography sx={{ color: 'red', mb: 2 }}>
            {profileError}. Please enter your information manually.
          </Typography>
        ) : null}
        
        <Grid container spacing={3}>
          {/* Buyer Information Section */}
          <Box sx={{ gap: 5, m:2}}>
          <FormControlLabel
  control={
    <Switch
      checked={orderInfo.isGift}
      onChange={handleGiftToggle}
      sx={{
        '& .MuiSwitch-switchBase': {
          transition: 'all 0.3s ease-in-out',
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#FFD700',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            boxShadow: '0px 0px 8px rgba(255, 215, 0, 0.6)',
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#FFD700',
        },
        '& .MuiSwitch-track': {
          backgroundColor: '#555', // Default track color
        },
      }}
    />
  }
  label={
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: '8px',
        padding: '6px 12px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          boxShadow: '0px 0px 12px rgba(255, 215, 0, 0.4)',
        },
      }}
    >
      <CardGiftcardIcon sx={{ color: '#FFD700', fontSize: 26 }} />
      <Typography sx={{ 
        color: 'white', 
        fontFamily: "'Jersey 15', sans-serif", 
        fontSize: '1.1rem', 
 
      }}>
        Send as Gift
      </Typography>
    </Box>
  }
/>
</Box>

          {!orderInfo.isGift && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "#FFD700", mb: 2 }}>
                  Your Information
                </Typography>

               
          
       
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  value={orderInfo.fullName}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={orderInfo.phoneNumber}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Shipping Address"
                  multiline
                  rows={3}
                  value={orderInfo.address}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
            </>
          )}
          
          {/* Gift Recipient Information Section */}
          {orderInfo.isGift && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "#FFD700", mb: 2 }}>
                  Gift Recipient Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="gift.fullName"
                  label="Recipient's Full Name"
                  value={orderInfo.giftRecipient.fullName}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="gift.phoneNumber"
                  label="Recipient's Phone Number"
                  value={orderInfo.giftRecipient.phoneNumber}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="gift.address"
                  label="Recipient's Shipping Address"
                  multiline
                  rows={3}
                  value={orderInfo.giftRecipient.address}
                  onChange={handleOrderInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                  }}
                />
              </Grid>
            </>
          )}
          
       
          <Grid item xs={12}>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
            <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "#FFD700", mb: 2 }}>
              Order Notes
            </Typography>
            <TextField
              fullWidth
              name="notes"
              label="Add notes for your order (optional)"
              multiline
              rows={3}
              value={orderInfo.notes || ''}
              onChange={handleOrderInfoChange}
              placeholder="Special instructions for delivery, gift message, etc."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
              }}
            />
          </Grid>
          
          {/* Payment Method Section - Always visible */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
            <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "#FFD700", mb: 2 }}>
              Payment Method
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Object.entries(paymentMethods).map(([method, details]) => (
                <Box
                  key={method}
                  onClick={() => handleOrderInfoChange({ target: { name: 'paymentMethod', value: method } })}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: orderInfo.paymentMethod === method 
                      ? '2px solid #FFD700' 
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: orderInfo.paymentMethod === method 
                      ? 'rgba(255, 215, 0, 0.15)' 
                      : 'rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: orderInfo.paymentMethod === method 
                        ? 'rgba(255, 215, 0, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: orderInfo.paymentMethod === method 
                        ? 'rgba(255, 215, 0, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: orderInfo.paymentMethod === method ? '#FFD700' : 'white'
                    }}>
                      {details.icon}
                    </Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                       
                        fontFamily: "'Jersey 15', sans-serif"
                      }}
                    >
                      {details.name}
                    </Typography>
                  </Box>
                  
                  <Radio 
                    checked={orderInfo.paymentMethod === method}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)', 
                      '&.Mui-checked': { 
                        color: '#FFD700' 
                      } 
                    }}
                    onChange={() => {}}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, justifyContent: 'space-between', borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          Cancel
        </Button>
        
        <ButtonCus
          variant="button-pixel-green"
          width="150px"
          height="40px"
          onClick={onClose}
          disabled={(orderInfo.isGift ? 
            (!orderInfo.giftRecipient.fullName || !orderInfo.giftRecipient.phoneNumber || !orderInfo.giftRecipient.address) : 
            (!orderInfo.fullName || !orderInfo.phoneNumber || !orderInfo.address)
          )}
        >
          <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
            Save Details
          </Typography>
        </ButtonCus>
      </DialogActions>
    </Dialog>
  );
};

export default OrderInfoDialog; 