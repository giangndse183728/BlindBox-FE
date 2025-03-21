import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Chip, Grid, Pagination, Stack, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Menu
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getAdminAccounts, updateAdminAccount, deleteAdminAccount } from '../../../../services/adminApi';

// Configuration for user roles and verification status
const USER_ROLES = {
  0: { label: 'Admin', color: '#f57c00', bgColor: 'rgba(245, 124, 0, 0.2)' },
  1: { label: 'User', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)' },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)' }
};

const VERIFY_STATUS = {
  0: { label: 'Not Verified', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Verified', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <VerifiedIcon /> },
  2: { label: 'Banned', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <DeleteIcon /> },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
};

// Utility function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// UserRow Component
function UserRow({ user, refreshUsers }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [banConfirmDialogOpen, setBanConfirmDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newVerifyStatus, setNewVerifyStatus] = useState(user?.verify);
  const [newRole, setNewRole] = useState(user?.role);
  const [isLoading, setIsLoading] = useState(false);

  const openActions = Boolean(anchorEl);

  const getRoleConfig = (role) => USER_ROLES[role] || USER_ROLES.default;
  const getVerifyConfig = (verifyStatus) => VERIFY_STATUS[verifyStatus] || VERIFY_STATUS.default;

  const handleActionsClick = (event) => setAnchorEl(event.currentTarget);
  const handleActionsClose = () => setAnchorEl(null);
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleActionsClose();
  };
  const handleUpdateClick = () => {
    setUpdateDialogOpen(true);
    handleActionsClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await deleteAdminAccount(user._id);
      setDeleteDialogOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyStatusChange = (e) => {
    const value = e.target.value;
    if (value === 2) { // Banned
      setBanConfirmDialogOpen(true);
    } else {
      setNewVerifyStatus(value);
    }
  };

  const handleBanConfirm = async () => {
    setNewVerifyStatus(2);
    setBanConfirmDialogOpen(false);
    await handleUpdateConfirm();
  };

  const handleUpdateConfirm = async () => {
    try {
      setIsLoading(true);
      await updateAdminAccount(user._id, { verifyStatus: newVerifyStatus, role: newRole });
      setUpdateDialogOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Failed to update account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="60px">
          <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)} sx={{ color: 'white' }}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width="15%" sx={{ color: 'white' }}>{user?.userName || 'N/A'}</TableCell>
        <TableCell width="25%" sx={{ color: 'white' }}>{user?.email || 'N/A'}</TableCell>
        <TableCell width="13%" sx={{ color: 'white' }}>{user?.phoneNumber || 'N/A'}</TableCell>
        <TableCell width="13%" sx={{ textAlign: 'center' }}>
          <Chip
            label={getRoleConfig(user.role).label}
            sx={{
              bgcolor: getRoleConfig(user.role).bgColor,
              color: getRoleConfig(user.role).color,
              border: `1px solid ${getRoleConfig(user.role).color}`,
              fontWeight: 'bold',
              maxWidth: '100%',
            }}
          />
        </TableCell>
        <TableCell width="15%" sx={{ textAlign: 'center' }}>
          <Chip
            label={getVerifyConfig(user.verify).label}
            icon={<Box sx={{ '& svg': { color: getVerifyConfig(user.verify).color, fontSize: '1rem', mr: -0.5 } }}>{getVerifyConfig(user.verify).icon}</Box>}
            sx={{
              bgcolor: getVerifyConfig(user.verify).bgColor,
              color: getVerifyConfig(user.verify).color,
              border: `1px solid ${getVerifyConfig(user.verify).color}`,
              fontWeight: 'bold',
              width: '120px',
              justifyContent: 'center',
            }}
          />
        </TableCell>
        <TableCell width="12%" sx={{ textAlign: 'center' }}>
          <Chip
            label={user?.isRegisterSelling ? 'Yes' : 'No'}
            sx={{
              bgcolor: user?.isRegisterSelling ? 'rgba(76, 175, 80, 0.2)' : 'rgba(117, 117, 117, 0.2)',
              color: user?.isRegisterSelling ? '#4CAF50' : '#757575',
              border: `1px solid ${user?.isRegisterSelling ? '#4CAF50' : '#757575'}`,
              fontWeight: 'bold',
              maxWidth: '100%',
            }}
          />
        </TableCell>
        <TableCell width="10%" sx={{ textAlign: 'center' }}>
          <IconButton size="small" onClick={handleActionsClick} sx={{ color: 'white' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openActions}
            onClose={handleActionsClose}
            PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 1 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUpdateClick} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <EditIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#2196F3' }} />
              Update Status
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#F44336' }} />
              Delete Account
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                User Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, height: '100%' }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>Account Information</Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>User ID: {user?._id || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>User Name: {user?.userName || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>Full Name: {user?.fullName || 'Not provided'}</Typography>
                      <Typography sx={{ color: 'white' }}>Email: {user?.email || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>Phone: {user?.phoneNumber || 'Not provided'}</Typography>
                      <Typography sx={{ color: 'white' }}>Address: {user?.address || 'Not provided'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, height: '100%' }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>Account Details</Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>Role: {getRoleConfig(user?.role).label}</Typography>
                      <Typography sx={{ color: 'white' }}>Verification Status: {getVerifyConfig(user?.verify).label}</Typography>
                      <Typography sx={{ color: 'white' }}>
                        Seller Status: {user?.isRegisterSelling ? 'Registered as Seller' : 'Not a Seller'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>Remaining Credits: {user?.remainingCredits || 0}</Typography>
                      <Typography sx={{ color: 'white' }}>
                        Created: {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Last Updated: {user?.updatedAt ? formatDate(user.updatedAt) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete the account for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName}</span>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{ backgroundColor: '#F44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>Update Account Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
            Update status for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName}</span>
          </DialogContentText>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' } }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Verification Status</InputLabel>
            <Select
              value={newVerifyStatus}
              onChange={handleVerifyStatusChange}
              label="Verification Status"
              sx={{ color: 'white' }}
            >
              <MenuItem value={0}>Not Verified</MenuItem>
              {/* Verified (1) is not an option here */}
              <MenuItem value={2}>Ban</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' } }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>User Role</InputLabel>
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)} label="User Role" sx={{ color: 'white' }}>
              <MenuItem value={0}>Admin</MenuItem>
              <MenuItem value={1}>User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setUpdateDialogOpen(false)}
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateConfirm}
            sx={{ backgroundColor: '#2196F3', color: 'white', '&:hover': { backgroundColor: '#1976d2' } }}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <Dialog
        open={banConfirmDialogOpen}
        onClose={() => setBanConfirmDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>Confirm Ban</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to ban the account for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setBanConfirmDialogOpen(false)}
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBanConfirm}
            sx={{ backgroundColor: '#F44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ManageUsers Component
export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAdminAccounts();
      if (response.result) setUsers(response.result);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === parseInt(roleFilter);
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = page * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', textAlign: 'center' }}>
        Manage Users 👥
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' } }}>
        <TextField
          placeholder="Search by username, email or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></InputAdornment>,
            sx: {
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
            },
          }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 180, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#FFD700' } }}>Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Role"
            IconComponent={FilterListIcon}
            sx={{ color: 'white' }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="0">Admin</MenuItem>
            <MenuItem value="1">User</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
          No users found matching your criteria.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell width="60px" />
                  <TableCell width="15%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Username</TableCell>
                  <TableCell width="25%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Email</TableCell>
                  <TableCell width="13%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Phone</TableCell>
                  <TableCell width="13%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Role</TableCell>
                  <TableCell width="15%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Verification</TableCell>
                  <TableCell width="12%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Seller</TableCell>
                  <TableCell width="10%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((user) => (
                  <UserRow key={user._id} user={user} refreshUsers={refreshUsers} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, p: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }}>
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </Typography>
              </Box>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.3)' },
                    },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  },
                }}
              />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}

