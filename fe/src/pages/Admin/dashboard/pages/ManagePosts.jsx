import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Chip, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Grid, Menu, Tabs, Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { postApi } from '../../../../services/postApi';

const POST_STATUS = {
  0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Approved', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
  2: { label: 'Rejected', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
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

function PostRow({ post, refreshPosts, updatePostLocally }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusConfig = (status) => {
    return POST_STATUS[status] || POST_STATUS.default;
  };

  const handleStatusClick = (status) => {
    setStatusToUpdate(status);
    setDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await postApi.updatePostStatus(post.slug, post._id, statusToUpdate);
      updatePostLocally(post._id, statusToUpdate);
      setDialogOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error('Error updating post status:', error);
      refreshPosts();
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        <TableCell sx={{ color: 'white' }}>{post?.name || 'N/A'}</TableCell>
        <TableCell sx={{ color: 'white' }}>{post?.createdBy || 'N/A'}</TableCell>
        <TableCell sx={{ color: 'white' }}>{post?.createdAt ? formatDate(post.createdAt) : 'N/A'}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {post && (
            <Chip 
              label={getStatusConfig(post.status).label}
              sx={{
                bgcolor: getStatusConfig(post.status).bgColor,
                color: getStatusConfig(post.status).color,
                border: `1px solid ${getStatusConfig(post.status).color}`,
                fontWeight: 'bold',
              }}
              icon={
                <Box sx={{ 
                  '& svg': { 
                    color: getStatusConfig(post.status).color,
                    fontSize: '1rem',
                    mr: -0.5
                  } 
                }}>
                  {getStatusConfig(post.status).icon}
                </Box>
              }
            />
          )}
        </TableCell>
        <TableCell align="center">
          {post?.status === 0 && (
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openMenu ? 'long-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ color: 'white' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: 1,
                    maxWidth: 'none',
                    width: '250px'
                  }
                }}
              >
                {post.image && (
                  <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    <Box
                      component="img"
                      src={post.image}
                      alt={post.name}
                      sx={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    />
                    <Typography 
                      sx={{ 
                        color: 'white',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {post.name}
                    </Typography>
                  </Box>
                )}
                <MenuItem 
                  onClick={() => {
                    handleStatusClick(1);
                    handleMenuClose();
                  }}
                  sx={{ 
                    color: '#4CAF50',
                    '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                  }}
                  disabled={loading}
                >
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Approve
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleStatusClick(2);
                    handleMenuClose();
                  }}
                  sx={{ 
                    color: '#F44336',
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                  }}
                  disabled={loading}
                >
                  <CancelIcon sx={{ mr: 1 }} />
                  Reject
                </MenuItem>
              </Menu>
            </div>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                Post Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  {post.image && (
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                      borderRadius: 1,
                      height: '100%'
                    }}>
                      <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                        Product Image
                      </Typography>
                      <Box
                        component="img"
                        src={post.image}
                        alt={post.name}
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: 1,
                          border: '2px solid rgba(255, 215, 0, 0.3)'
                        }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Product Information
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>
                        Price: ${parseFloat(post.price).toFixed(2)}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Quantity: {post.quantity}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Brand: {post.brand}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Description
                    </Typography>
                    <Typography sx={{ color: 'white', ml: 2 }}>
                      {post.description}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleStatusUpdate}
        title={`${statusToUpdate === 1 ? 'Approve' : 'Reject'} Post`}
        message={`Are you sure you want to ${statusToUpdate === 1 ? 'approve' : 'reject'} this post?`}
      />
    </React.Fragment>
  );
}

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postApi.getAllPosts();
      if (response.result) {
        // Filter out any accessories that might slip through
        const productsOnly = response.result.filter(post => post.category === 0);
        setPosts(productsOnly);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', textAlign: 'center' }}>
        Manage Posts 📝
      </Typography>

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 3, 
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#FFD700',
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#FFD700',
              },
            },
          }}
        >
          <Tab label="Product Posts" />
          <Tab label="Trading Posts" />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
          }}>
            <TextField
              placeholder="Search by title or author"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                IconComponent={FilterListIcon}
                sx={{ color: 'white' }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="0">Pending</MenuItem>
                <MenuItem value="1">Approved</MenuItem>
                <MenuItem value="2">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#FFD700' }} />
            </Box>
          ) : filteredPosts.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              No posts found matching your criteria.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="60px" />
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Title</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Author</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <PostRow 
                      key={post._id} 
                      post={post}
                      refreshPosts={fetchPosts}
                      updatePostLocally={(postId, newStatus) => {
                        setPosts(prevPosts => 
                          prevPosts.map(p => p._id === postId ? {...p, status: newStatus} : p)
                        );
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Trading Posts Feature - Coming Soon! 🚀
          </Typography>
        </Box>
      )}
    </Box>
  );
}
