import React from "react";
import { 
  Box, Typography, TextField, InputAdornment, CircularProgress, 
} from "@mui/material";
import { Link } from "react-router-dom";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import ButtonCus from "../../components/Button/ButtonCus";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';

const OrderSummary = ({ 
  orderInfo, 
  paymentMethods,
  subtotal, 
  totalWithShipping,
  cartItems,
  isLoading,
  checkoutLoading,
  checkoutError,
  handleOpenOrderDialog,
  handleCheckout
}) => {
  return (
    <Box sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      p: 3,
      borderRadius: 2,
      position: 'sticky',
      top: 90
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
          Order Summary
        </Typography>
      </Box>

      {/* Display shipping info summary if available - make clickable to open dialog */}
      {(orderInfo.isGift ? orderInfo.giftRecipient.fullName : orderInfo.fullName) && (
        <Box 
          sx={{
            mb: 3,
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              border: '1px dashed rgba(255, 255, 255, 0.4)',
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={handleOpenOrderDialog}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{
              color: "white",
              fontFamily: "'Jersey 15', sans-serif",
              fontSize: '0.9rem',
              mb: 0.5
            }}>
              {orderInfo.isGift ? 'Gift to: ' + orderInfo.giftRecipient.fullName : orderInfo.fullName}
            </Typography>
            <EditIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
          </Box>
          <Typography sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "'Jersey 15', sans-serif",
            fontSize: '0.8rem',
            mb: 0.5
          }}>
            {orderInfo.isGift ? orderInfo.giftRecipient.phoneNumber : orderInfo.phoneNumber}
          </Typography>
          <Typography sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "'Jersey 15', sans-serif",
            fontSize: '0.8rem'
          }}>
            {orderInfo.isGift ? orderInfo.giftRecipient.address : orderInfo.address}
          </Typography>
        </Box>
      )}

      {/* Payment Method - make clickable to open dialog */}
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          p: 1,
          borderRadius: 1,
          bgcolor: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={handleOpenOrderDialog}
      >
        <Typography sx={{
          color: "white",
          fontFamily: "'Jersey 15', sans-serif",
        }}>
          Payment Method:
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          color: "white",
          gap: 1
        }}>
          {paymentMethods[orderInfo.paymentMethod]?.icon}
          <Typography>
            {paymentMethods[orderInfo.paymentMethod]?.name || 'Not selected'}
          </Typography>
          <EditIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', ml: 1 }} />
        </Box>
      </Box>

      {/* Coupon Input Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter coupon code"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            sx: {
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            },
          }}
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: 'white',
            },
          }}
        />
      </Box>

      {/* Gift Status */}
      {orderInfo.isGift && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          alignItems: 'center'
        }}>
          <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
            Gift:
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#FFD700',
            gap: 1
          }}>
            <CardGiftcardIcon />
            <Typography>Yes</Typography>
          </Box>
        </Box>
      )}

      {/* Price Breakdown */}
      <Box sx={{ mb: 3 }}>
        {/* Subtotal */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
            Subtotal:
          </Typography>
          <Typography sx={{ color: "white" }}>
            ${subtotal.toFixed(2)}
          </Typography>
        </Box>

        {/* Discount */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
        }}>
          <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
            Discount:
          </Typography>
          <Typography sx={{ color: "#ff4444" }}>
            -$0.00
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{
          width: '100%',
          height: '1px',
          bgcolor: 'rgba(255,255,255,0.1)',
          my: 2
        }} />

        {/* Total */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
        }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontFamily: "'Jersey 15', sans-serif",
              ...yellowGlowAnimation
            }}
          >
            Total:
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontFamily: "'Jersey 15', sans-serif",
            }}
          >
            ${totalWithShipping.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Checkout Buttons */}
      <ButtonCus
        variant="button-pixel-green"
        width="100%"
        height="40px"
        onClick={handleCheckout}
        disabled={
          isLoading ||
          checkoutLoading ||
          cartItems.length === 0 ||
          (orderInfo.isGift ?
            (!orderInfo.giftRecipient.fullName || !orderInfo.giftRecipient.phoneNumber || !orderInfo.giftRecipient.address) :
            (!orderInfo.fullName || !orderInfo.phoneNumber || !orderInfo.address)
          )
        }
      >
        {checkoutLoading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
            Place Order
          </Typography>
        )}
      </ButtonCus>

      {/* Display checkout error if any */}
      {checkoutError && (
        <Typography sx={{ color: 'red', mt: 2, textAlign: 'center', fontSize: '0.9rem' }}>
          {checkoutError}
        </Typography>
      )}

      <Link to="/Collection-page" style={{ textDecoration: "none" }}>
        <ButtonCus
          variant="button-pixel"
          width="100%"
          height="30px"
          sx={{ mt: 2 }}
        >
          <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
            Continue Shopping
          </Typography>
        </ButtonCus>
      </Link>
    </Box>
  );
};

export default OrderSummary;
