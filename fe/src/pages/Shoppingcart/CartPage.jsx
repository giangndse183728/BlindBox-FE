import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import useCartStore from './CartStore';
import CartItemsList from './CartItemsList';
import OrderSummary from './OrderSummary';
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Grid, CircularProgress,
} from "@mui/material";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import { fetchProfile } from '../../services/userApi';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OrderInfoDialog from './OrderInfoDialog';
import { createOrder } from '../../services/ordersApi';
import { toast } from 'react-toastify';
import OrderSuccessScreen from './OrderSuccessScreen';


const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, fetchCartItems, isLoading, error } = useCartStore();

  const [orderInfo, setOrderInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    paymentMethod: 'cod',
    isGift: false,
    notes: '', 
    giftRecipient: {
      fullName: '',
      phoneNumber: '',
      address: ''
    }
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  // State for quantity inputs
  const [quantityInputs, setQuantityInputs] = useState({});

  // State for checkboxes
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setProfileLoading(true);
        const userData = await fetchProfile();

        setOrderInfo(prev => ({
          ...prev,
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || ''
        }));

        setProfileError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileError('Failed to load user information');
      } finally {
        setProfileLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const paymentMethods = {
    cod: { name: 'COD', icon: <LocalShippingIcon /> },
    banking: { name: 'Banking', icon: <AccountBalanceIcon /> }
  };

  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;

    // Check if this is for the gift recipient
    if (name.startsWith('gift.')) {
      const giftField = name.split('.')[1];
      setOrderInfo(prev => ({
        ...prev,
        giftRecipient: {
          ...prev.giftRecipient,
          [giftField]: value
        }
      }));
    } else {
      setOrderInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGiftToggle = (event) => {
    setOrderInfo(prev => ({
      ...prev,
      isGift: event.target.checked
    }));
  };

  const cartItems = cart || [];

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.totalPrice || 0);
  }, 0);

  const subtotal = totalPrice;
  const totalWithShipping = subtotal; // No shipping cost added

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Initialize quantity inputs when cart items load
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const initialInputs = {};
      cartItems.forEach(item => {
        initialInputs[item.product._id] = item.cartQuantity.toString();
      });
      setQuantityInputs(initialInputs);
      
      // Reset selection when cart changes
      setSelectedItems({});
      setSelectAll(false);
    }
  }, [cartItems]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.product.quantity) {
      updateQuantity(item.product._id, newQuantity);
      setQuantityInputs(prev => ({
        ...prev,
        [item.product._id]: newQuantity.toString()
      }));
    }
  };

  const handleQuantityInputChange = (item, value) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setQuantityInputs(prev => ({
        ...prev,
        [item.product._id]: value
      }));
    }
  };

  const handleQuantityInputBlur = (item) => {
    const inputValue = quantityInputs[item.product._id];
    let newQuantity;
    
    // Handle empty or invalid input
    if (inputValue === '' || isNaN(parseInt(inputValue))) {
      newQuantity = 1;
    } else {
      newQuantity = parseInt(inputValue);
      
      // Enforce min/max constraints
      if (newQuantity < 1) {
        newQuantity = 1;
      } else if (newQuantity > item.product.quantity) {
        newQuantity = item.product.quantity;
      }
    }
    
    // Update the cart and the input value
    updateQuantity(item.product._id, newQuantity);
    setQuantityInputs(prev => ({
      ...prev,
      [item.product._id]: newQuantity.toString()
    }));
  };

  const handleDelete = (item) => {
    removeFromCart(item.product._id);
  };

  const handleOpenOrderDialog = () => {
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

      const items = cartItems.map(item => ({
        itemId: item._id, 
        quantity: item.cartQuantity
      }));
      
      // Build the order data
      const orderData = {
        receiverInfo: {
          fullName: orderInfo.isGift ? orderInfo.giftRecipient.fullName : orderInfo.fullName,
          phoneNumber: orderInfo.isGift ? orderInfo.giftRecipient.phoneNumber : orderInfo.phoneNumber,
          address: orderInfo.isGift ? orderInfo.giftRecipient.address : orderInfo.address
        },
        orderType: 1, 
        promotionId: "", 
        notes: orderInfo.notes || (orderInfo.isGift ? "This is a gift" : ""),
        paymentMethod: orderInfo.paymentMethod === 'cod' ? 0 : 1, 
        items: items 
      };
      
      const response = await createOrder(orderData);
      
      clearCart();
      
      toast.success('Order placed successfully!');

      navigate('/order-success', { 
        state: { 
          orderData: response.result,
          paymentMethod: orderInfo.paymentMethod
        }
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors)
          .map(err => err.msg)
          .join(', ');
        setCheckoutError(errorMessages || 'Validation error. Please check your information.');
        toast.error(errorMessages || 'Validation error. Please check your information.');
      } else {
        setCheckoutError(error.message || 'Failed to place order. Please try again.');
        toast.error(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Handle checkbox selection
  const handleItemSelect = (productId) => {
    const newSelectedItems = {
      ...selectedItems,
      [productId]: !selectedItems[productId]
    };
    setSelectedItems(newSelectedItems);
    
    // Update selectAll based on whether all items are now selected
    const allSelected = cartItems.every(item => 
      productId === item.product._id ? newSelectedItems[productId] : newSelectedItems[item.product._id]
    );
    setSelectAll(allSelected);
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newSelectedItems = {};
    if (newSelectAll) {
      cartItems.forEach(item => {
        newSelectedItems[item.product._id] = true;
      });
    }
    setSelectedItems(newSelectedItems);
  };

  // Delete selected items or clear cart
  const handleDeleteSelected = async () => {
    if (areAllItemsSelected()) {
      // If all items are selected, use clearCart
      clearCart();
    } else {
      // Otherwise, delete only selected items
      const selectedProductIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
      
      if (selectedProductIds.length === 0) {
        toast.info('No items selected to remove');
        return;
      }

      try {
        for (const productId of selectedProductIds) {
          await removeFromCart(productId);
        }
        setSelectedItems({});
      } catch (error) {
        toast.error('Cannot remove selected items from cart');
      }
    }
  };

  // Function to check if all items are actually selected
  const areAllItemsSelected = () => {
    return cartItems.length > 0 && cartItems.every(item => selectedItems[item.product._id]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  return (
    <>
      {orderSuccess && orderData ? (
        <OrderSuccessScreen orderData={orderData} />
      ) : (
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
        }} />
      )}

      <Grid container data-aos="fade" data-aos-delay="200" sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 3,
      }}>
        {cartItems.length > 0 && (
          <Box sx={{ width: '93%', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h5"
              fontFamily="'Jersey 15', sans-serif"
              sx={{
                color: "white",
                fontSize: '2.2rem',
                ...yellowGlowAnimation,
                textAlign: 'left'
              }}
            >
              -  &nbsp;Shopping Cart &nbsp;  -
            </Typography>
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: '#FFD700' }} />
          </Box>
        ) : error ? (
          <Box sx={{ mt: 10 }}>
            <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "red", textAlign: 'center', fontSize: '2rem' }}>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => fetchCartItems()}
                sx={{
                  color: "white",
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  "&:hover": { bgcolor: "yellow", color: "black" },
                }}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        ) : cartItems.length === 0 ? (
          <Box sx={{ mt: 10 }}>
            <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', ...yellowGlowAnimation, fontSize: '4rem' }}>Your cart is empty!!</Typography>
            <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', fontSize: '2rem' }}>You can find what you seek with a click of a button</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Link to="/Collection-page" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: "white",
                    border: "2px solid white",
                    backgroundColor: "transparent",
                    "&:hover": { bgcolor: "yellow", color: "black" },
                  }}
                >
                  MAGIC!!!!!
                </Button>
              </Link>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ px: 5 }}>
            {/* Cart Items List Component */}
            <Grid item xs={12} lg={9}>
              <CartItemsList 
                cartItems={cartItems}
                selectedItems={selectedItems}
                selectAll={selectAll}
                quantityInputs={quantityInputs}
                isLoading={isLoading}
                handleItemSelect={handleItemSelect}
                handleSelectAll={handleSelectAll}
                handleDeleteSelected={handleDeleteSelected}
                handleQuantityChange={handleQuantityChange}
                handleQuantityInputChange={handleQuantityInputChange}
                handleQuantityInputBlur={handleQuantityInputBlur}
                handleDelete={handleDelete}
                areAllItemsSelected={areAllItemsSelected}
                      />
                    </Grid>

            {/* Order Summary Component */}
            <Grid item xs={12} lg={3}>
              <OrderSummary 
                orderInfo={orderInfo}
                paymentMethods={paymentMethods}
                subtotal={subtotal}
                totalWithShipping={totalWithShipping}
                cartItems={cartItems}
                isLoading={isLoading}
                checkoutLoading={checkoutLoading}
                checkoutError={checkoutError}
                handleOpenOrderDialog={handleOpenOrderDialog}
                handleCheckout={handleCheckout}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Dialog for order info */}
      <OrderInfoDialog
        open={openOrderDialog}
        onClose={handleCloseOrderDialog}
        orderInfo={orderInfo}
        handleOrderInfoChange={handleOrderInfoChange}
        handleGiftToggle={handleGiftToggle}
        profileLoading={profileLoading}
        profileError={profileError}
      />
    </>
  );
};

export default CartPage;