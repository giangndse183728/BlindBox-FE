import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Pagination, Chip, Grid, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { toast } from 'react-toastify';
import GlassCard from "../../components/Decor/GlassCard";
import { getSellerOrders, updateOrderStatus } from '../../services/ordersApi';
import ButtonCus from "../../components/Button/ButtonCus";
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';

const ORDER_STATUS = {
  0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Confirmed', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
  2: { label: 'Processing', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
  3: { label: 'Completed', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
  4: { label: 'Cancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> }
};

const PAYMENT_METHOD = {
  0: 'Cash On Delivery',
  1: 'Bank Transfer'
};

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          sx={{ 
            backgroundColor: '#FFD700', 
            color: 'black',
            '&:hover': { backgroundColor: '#E6C200' }
          }}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OrderRow({ order, refreshOrders, updateOrderLocally }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      // Map numeric status to string commands for the API
      let statusCommand;
      switch (statusToUpdate) {
        case 1: statusCommand = "confirm"; break;
        case 2: statusCommand = "process"; break;
        case 3: statusCommand = "complete"; break;
        case 4: statusCommand = "cancel"; break;
        default: statusCommand = "confirm"; 
      }
      
      // Optimistically update the UI before API call
      updateOrderLocally(order._id, statusToUpdate);
      
      await updateOrderStatus(order._id, statusCommand);

      toast.success(`Ordered: ${ORDER_STATUS[statusToUpdate].label}`);
      
      setDialogOpen(false);
      setLoading(false);

    } catch (error) {
      refreshOrders(); 
      toast.error('Failed to update order status');
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleStatusClick = (status) => {
    setStatusToUpdate(status);
    setDialogOpen(true);
  };


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'white' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: 'white' }}>{order._id}</TableCell>
        <TableCell sx={{ color: 'white' }}>{formatDate(order.createdAt)}</TableCell>
        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
          ${parseFloat(order.totalPrice).toFixed(2)}
        </TableCell>
        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
          {PAYMENT_METHOD[order.paymentMethod]}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Chip 
            label={ORDER_STATUS[order.status].label}
            sx={{
              bgcolor: ORDER_STATUS[order.status].bgColor,
              color: ORDER_STATUS[order.status].color,
              border: `1px solid ${ORDER_STATUS[order.status].color}`,
              fontWeight: 'bold',
            }}
            icon={
              <Box sx={{ 
                '& svg': { 
                  color: ORDER_STATUS[order.status].color,
                  fontSize: '1rem',
                  mr: -0.5
                } 
              }}>
                {ORDER_STATUS[order.status].icon}
              </Box>
            }
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                Order Details
              </Typography>
              
              {/* Order Status Stepper */}
              <OrderStatusStepper status={order.status} />

              {/* Status Update Buttons */}
              {order.status !== 4 && order.status !== 3 && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                  {order.status === 0 && (
                    <>
                      <ButtonCus
                        variant="button-pixel-green"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(1)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Confirm Order
                        </Typography>
                      </ButtonCus>
                      <ButtonCus
                        variant="button-pixel-red"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(4)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Cancel Order
                        </Typography>
                      </ButtonCus>
                    </>
                  )}
                  {order.status === 1 && (
                    <>
                      <ButtonCus
                        variant="button-pixel-blue"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(2)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Process Order
                        </Typography>
                      </ButtonCus>

                    </>
                  )}
               
                  {loading && <CircularProgress size={24} sx={{ color: '#FFD700' }} />}
                </Box>
              )}
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Shipping Information
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>
                        Recipient: {order.receiverInfo.fullName}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Phone: {order.receiverInfo.phoneNumber}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Address: {order.receiverInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 1 }}>
                Ordered Items
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Product</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'center' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'center' }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'right' }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box 
                              component="img" 
                              src={item.image} 
                              alt={item.productName}
                              sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                            />
                            <Typography sx={{ color: 'white' }}>
                              {item.productName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                          ${((item.price ? parseFloat(item.price) : 0).toFixed(2))}
                        </TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'center' }}>{item.quantity}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'right' }}>
                          ${(item.price ? parseFloat(item.price) : 0) * (item.quantity || 1).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                        ${(order.totalPrice ? parseFloat(order.totalPrice) : 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {order.notes && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: 1,
                }}>
                  <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                    Notes
                  </Typography>
                  <Typography sx={{ color: 'white', ml: 2 }}>
                    {order.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleStatusUpdate}
        title="Update Order Status"
        message={"Are you sure you want to update this order's status ?"}
      />
    </React.Fragment>
  );
}

export default function ManageSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {

    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  useEffect(() => {
    updateDisplayedOrders();
  }, [filteredOrders, page, itemsPerPage]);

  const fetchOrders = async () => {
 
    setLoading(true);
    try {
      const data = await getSellerOrders();
      setOrders(data.result);
      setFilteredOrders(data.result);
      filterOrders(data.result);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (ordersList = null) => {
    let filtered = [...(ordersList || orders)];
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const statusValue = parseInt(statusFilter);
      filtered = filtered.filter(order => order.status === statusValue);
    }
    
    setFilteredOrders(filtered);
    
    setPage(1);
    
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    
  
    const startIndex = 0; 
    const endIndex = itemsPerPage;
    setDisplayedOrders(filtered.slice(startIndex, endIndex));
  };
  
  const updateDisplayedOrders = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
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

  return (
    <GlassCard style={{width:'100%', padding:'30px', marginTop: '20px'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color:'whitesmoke' }}>
        Seller Order Management 🗒️
        </Typography>
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
          placeholder="Search by order ID or product"
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
            <MenuItem value="0">Pending</MenuItem>
            <MenuItem value="1">Confirm</MenuItem>
            <MenuItem value="2">Processing</MenuItem>
            <MenuItem value="3">Completed</MenuItem>
            <MenuItem value="4">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
          {orders.length === 0 ? 
            "No orders found. Your products haven't been purchased yet." : 
            "No matching orders found for your search criteria."}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="60px" /> {/* Expand/collapse control */}
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Total</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Payment Method</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrders.map((order) => (
                  <OrderRow 
                    key={order._id} 
                    order={order} 
                    refreshOrders={fetchOrders}
                    updateOrderLocally={(orderId, newStatus) => {
                      // Update the order status locally in all states
                      setOrders(prevOrders => 
                        prevOrders.map(o => o._id === orderId ? {...o, status: newStatus} : o)
                      );
                      setFilteredOrders(prevOrders => 
                        prevOrders.map(o => o._id === orderId ? {...o, status: newStatus} : o)
                      );
                      setDisplayedOrders(prevOrders => 
                        prevOrders.map(o => o._id === orderId ? {...o, status: newStatus} : o)
                      );
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination Controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 3,
            px: 1
          }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Showing {displayedOrders.length} of {filteredOrders.length} orders
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
  );
}