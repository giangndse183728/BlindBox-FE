import React, { useState, useEffect } from "react";
import { 
  Box, Typography, TextField, InputAdornment, CircularProgress, 
  MenuItem, Select, FormControl, FormHelperText, Chip, Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import ButtonCus from "../../components/Button/ButtonCus";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import { getBuyerPromotions } from '../../services/promoApi';
import { fetchProfile } from '../../services/userApi';
import { toast } from 'react-toastify';
import RefundIcon from '@mui/icons-material/Replay';

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
  handleCheckout,
  selectedPromotion,
  setSelectedPromotion
}) => {
  const [regularPromotions, setRegularPromotions] = useState([]);
  const [refundPromotions, setRefundPromotions] = useState([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoType, setPromoType] = useState('regular'); 
  const [userData, setUserData] = useState(null);

  // Fetch user data first
  useEffect(() => {
    const getUserData = async () => {
      try {
        const profile = await fetchProfile();
        setUserData(profile);
      } catch (error) {
        console.error('Error fetching user profile for promotions:', error);
      }
    };
    
    getUserData();
  }, []);

  // Fetch active promotions and separate them into regular and refund types
  useEffect(() => {
    if (!userData) return; // Wait for user data to be available
    
    const fetchPromotions = async () => {
      try {
        setPromoLoading(true);
        setPromoError(null);
        
        // Fetch all promotions
        const response = await getBuyerPromotions();
        
        if (response.result) {
          const now = new Date();
          const allValidPromotions = response.result.filter(promo => 
            promo.isActive && 
            new Date(promo.startDate) <= now && 
            new Date(promo.endDate) >= now
          );
          
          // Separate into regular and refund promotions
          const userRefundPromotions = [];
          const regularPromos = [];
          
          allValidPromotions.forEach(promo => {
            // Check if this is a refund promotion (has assignedTo field matching user ID)
            if (promo.assignedTo && promo.assignedTo === userData._id) {
              userRefundPromotions.push(promo);
            } else if (!promo.assignedTo) {
              // Only add to regular promotions if it doesn't have an assignedTo field
              regularPromos.push(promo);
            }
          });
          
          setRegularPromotions(regularPromos);
          setRefundPromotions(userRefundPromotions);
          
          // Set initial promo type
          if (regularPromos.length === 0 && userRefundPromotions.length > 0) {
            setPromoType('refund');
          }
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromoError('Failed to load promotions');
      } finally {
        setPromoLoading(false);
      }
    };

    fetchPromotions();
  }, [userData]);

  // Calculate discount when promotion changes
  useEffect(() => {
    if (!selectedPromotion) {
      setDiscount(0);
      return;
    }
    
    let calculatedDiscount = 0;
    
    // If selectedPromotion is an object with id and type properties
    if (typeof selectedPromotion === 'object' && selectedPromotion.id) {
      if (selectedPromotion.type === 'refund') {
        // Get the refund promo data
        const refundPromo = refundPromotions.find(p => p._id === selectedPromotion.id);
        if (refundPromo && refundPromo.discountAmount) {
          calculatedDiscount = refundPromo.discountAmount;
        }
      } else {
        // Get the regular promo data
        const promo = regularPromotions.find(p => p._id === selectedPromotion.id);
        if (promo) {
          // Check if this is a rate-based or amount-based promotion
          if (promo.discountRate === 0 && promo.discountAmount) {
            // If discountRate is 0, use the discountAmount directly
            calculatedDiscount = promo.discountAmount;
          } else if (promo.discountRate) {
            // Otherwise calculate based on rate
            calculatedDiscount = (subtotal * promo.discountRate) / 100;
          }
        }
      }
    } else {
      // Legacy handling for when selectedPromotion is just an ID string
      // Try to find it in regular promotions first
      const promo = regularPromotions.find(p => p._id === selectedPromotion);
      if (promo) {
        // Check if this is a rate-based or amount-based promotion
        if (promo.discountRate === 0 && promo.discountAmount) {
          // If discountRate is 0, use the discountAmount directly
          calculatedDiscount = promo.discountAmount;
        } else if (promo.discountRate) {
          // Otherwise calculate based on rate
          calculatedDiscount = (subtotal * promo.discountRate) / 100;
        }
      } else {
        // If not found in regular promotions, check refund promotions
        const refundPromo = refundPromotions.find(p => p._id === selectedPromotion);
        if (refundPromo && refundPromo.discountAmount) {
          calculatedDiscount = refundPromo.discountAmount;
        }
      }
    }
    
    // Ensure discount doesn't exceed the subtotal
    calculatedDiscount = Math.min(calculatedDiscount, subtotal);
    
    setDiscount(calculatedDiscount);
  }, [selectedPromotion, regularPromotions, refundPromotions, subtotal]);

  // Calculate total with discount
  const finalTotal = totalWithShipping - discount;

  // Handle promotion selection
  const handlePromoChange = (event) => {
    const promoId = event.target.value;
    
    if (promoId) {
      const isRefundPromo = promoType === 'refund';
      const selectedPromo = isRefundPromo 
        ? refundPromotions.find(p => p._id === promoId)
        : regularPromotions.find(p => p._id === promoId);
      
      // Create a structured object with both the ID and type
      setSelectedPromotion({
        id: promoId,
        type: promoType,
        promotion: selectedPromo  // Include the full promotion data
      });
      
      if (isRefundPromo) {
        toast.success(`Applied Refund: ${selectedPromo.name} ($${selectedPromo.discountAmount.toFixed(2)} off)`);
      } else if (selectedPromo.discountRate === 0 && selectedPromo.discountAmount) {
        toast.success(`Applied: ${selectedPromo.name} ($${selectedPromo.discountAmount.toFixed(2)} off)`);
      } else {
        toast.success(`Applied: ${selectedPromo.name} (${selectedPromo.discountRate}% off)`);
      }
    } else {
      setSelectedPromotion(null);
      toast.info('Promotion removed');
    }
  };

  // Don't show refund promotions tab if there are none
  const hasRefundPromotions = refundPromotions.length > 0;
  const hasRegularPromotions = regularPromotions.length > 0;

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

      {/* Only show promotion tabs if we have both regular and refund promotions */}
      {(hasRegularPromotions && hasRefundPromotions) && (
        <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
          <Chip
            label="Discounts"
            icon={<LocalOfferIcon />}
            clickable
            onClick={() => {
              setPromoType('regular');
              setSelectedPromotion(null);
            }}
            sx={{
              flex: 1,
              color: 'white',
              bgcolor: promoType === 'regular' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
              border: promoType === 'regular' ? '1px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.2)',
              }
            }}
          />
          <Chip
            label="Refund Promotion"
            icon={<RefundIcon />}
            clickable
            onClick={() => {
              setPromoType('refund');
              setSelectedPromotion(null);
            }}
            sx={{
              flex: 1,
              color: 'white',
              bgcolor: promoType === 'refund' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
              border: promoType === 'refund' ? '1px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.2)',
              }
            }}
          />
        </Box>
      )}
      
      {/* Promotion Dropdown */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <Select
            value={selectedPromotion ? (typeof selectedPromotion === 'object' ? selectedPromotion.id : selectedPromotion) : ''}
            onChange={handlePromoChange}
            displayEmpty
            startAdornment={
              <InputAdornment position="start">
                {promoType === 'refund' ? 
                  <RefundIcon sx={{ color: 'white' }} /> : 
                  <LocalOfferIcon sx={{ color: 'white' }} />}
              </InputAdornment>
            }
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {promoType === 'refund' ? 'Select a refund credit' : 'Select a promotion'}
                </Typography>;
              }
              
              if (promoType === 'refund') {
                const promo = refundPromotions.find(p => p._id === selected);
                return promo ? `${promo.name} ($${promo.discountAmount.toFixed(2)})` : 'Select a refund credit';
              } else {
                const promo = regularPromotions.find(p => p._id === selected);
                if (!promo) return 'Select a promotion';
                
                return promo.discountRate === 0 && promo.discountAmount
                  ? `${promo.name} ($${promo.discountAmount.toFixed(2)})`
                  : `${promo.name} (${promo.discountRate}%)`;
              }
            }}
            disabled={promoLoading || 
              (promoType === 'regular' && regularPromotions.length === 0) || 
              (promoType === 'refund' && refundPromotions.length === 0)}
            sx={{
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
              '& .MuiSelect-icon': {
                color: 'white',
              }
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            
            {promoType === 'regular' && regularPromotions.map((promo) => (
              <MenuItem key={promo._id} value={promo._id}>
                {promo.name} - {promo.discountRate === 0 && promo.discountAmount 
                  ? `$${promo.discountAmount.toFixed(2)} off` 
                  : `${promo.discountRate}% off`}
              </MenuItem>
            ))}
            
            {promoType === 'refund' && refundPromotions.map((promo) => (
              <MenuItem key={promo._id} value={promo._id}>
                {promo.name} - ${promo.discountAmount.toFixed(2)} off
                {promo.expiresIn && 
                  <Typography component="span" sx={{ ml: 1, fontSize: '0.8rem', color: 'orange' }}>
                    (Expires in {promo.expiresIn} days)
                  </Typography>
                }
              </MenuItem>
            ))}
          </Select>
          
          {promoLoading && <FormHelperText sx={{ color: 'yellow' }}>Loading promotions...</FormHelperText>}
          {promoError && <FormHelperText sx={{ color: 'red' }}>{promoError}</FormHelperText>}
          
          {!promoLoading && !promoError && promoType === 'regular' && regularPromotions.length === 0 && 
            <FormHelperText sx={{ color: 'rgba(255,255,255,0.7)' }}>No active promotions available</FormHelperText>
          }
          
          {!promoLoading && !promoError && promoType === 'refund' && refundPromotions.length === 0 && 
            <FormHelperText sx={{ color: 'rgba(255,255,255,0.7)' }}>No refund credits available</FormHelperText>
          }
        </FormControl>
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
            {selectedPromotion && typeof selectedPromotion === 'object' && selectedPromotion.type === 'refund' 
              ? 'Refund Credit:' 
              : 'Discount:'}
          </Typography>
          <Typography sx={{ color: "#ff4444" }}>
            -${discount.toFixed(2)}
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
            ${finalTotal.toFixed(2)}
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
