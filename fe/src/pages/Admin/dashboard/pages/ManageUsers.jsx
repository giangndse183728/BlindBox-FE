import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Chip, Grid, Pagination, Stack, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Menu
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getAdminAccounts, updateAccountStatus } from '../../../../services/adminApi';

// Configuration for user roles and verification status
const USER_ROLES = {
  0: { label: 'Admin', color: '#f57c00', bgColor: 'rgba(245, 124, 0, 0.2)' },
  1: { label: 'User', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)' },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)' }
};

const VERIFY_STATUS = {
  0: { label: 'Unverified', color: '#FF8900', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Verified', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <VerifiedIcon /> },
  2: { label: 'Banned', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <DeleteIcon /> },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
};

// Utility function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
};

// Helper functions to safely get role and verification configs
const getRoleConfig = (role) => USER_ROLES[role] !== undefined ? USER_ROLES[role] : USER_ROLES.default;
const getVerifyConfig = (verifyStatus) =>
  VERIFY_STATUS[verifyStatus] !== undefined ? VERIFY_STATUS[verifyStatus] : VERIFY_STATUS.default;

// UserRow Component
function UserRow({ user, refreshUsers }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newVerifyStatus, setNewVerifyStatus] = useState(user?.verify ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !user._id) {
    return (
      <TableRow>
        <TableCell colSpan={8} sx={{ color: 'white', textAlign: 'center' }}>
          Invalid user data
        </TableCell>
      </TableRow>
    );
  }

  const openActions = Boolean(anchorEl);
  const roleConfig = getRoleConfig(user.role);
  const verifyConfig = getVerifyConfig(user.verify);

  const handleActionsClick = (event) => setAnchorEl(event.currentTarget);
  const handleActionsClose = () => setAnchorEl(null);
  const handleUpdateClick = () => {
    setUpdateDialogOpen(true);
    handleActionsClose();
  };

  const handleVerifyStatusChange = (e) => {
    setNewVerifyStatus(Number(e.target.value));
  };

  const handleUpdateConfirm = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      setIsLoading(true);
      const response = await updateAccountStatus(user._id, { verify: newVerifyStatus });

      if (response) {
        setUpdateDialogOpen(false);
        setConfirmDialogOpen(false);
        refreshUsers();
        toast.success(`Account status updated to ${VERIFY_STATUS[newVerifyStatus].label}`);
      } else {
        throw new Error('Failed to update account status');
      }
    } catch (error) {
      console.error('Failed to update account:', error);
      toast.error(error.message || 'Failed to update account status');
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
        <TableCell width="15%" sx={{ color: 'white' }}>{user.userName || 'N/A'}</TableCell>
        <TableCell width="25%" sx={{ color: 'white' }}>{user.email || 'N/A'}</TableCell>
        <TableCell width="13%" sx={{ color: 'white' }}>{user.phoneNumber || 'N/A'}</TableCell>
        <TableCell width="13%" sx={{ textAlign: 'center' }}>
          <Chip
            label={roleConfig.label}
            sx={{
              bgcolor: roleConfig.bgColor,
              color: roleConfig.color,
              border: `1px solid ${roleConfig.color}`,
              fontWeight: 'bold',
              maxWidth: '100%',
            }}
          />
        </TableCell>
        <TableCell width="15%" sx={{ textAlign: 'center' }}>
          <Chip
            label={verifyConfig.label}
            icon={<Box sx={{ '& svg': { color: verifyConfig.color, fontSize: '1rem', mr: -0.5 } }}>
              {verifyConfig.icon}
            </Box>}
            sx={{
              bgcolor: verifyConfig.bgColor,
              color: verifyConfig.color,
              border: `1px solid ${verifyConfig.color}`,
              fontWeight: 'bold',
              width: '120px',
              justifyContent: 'center',
            }}
          />
        </TableCell>
        <TableCell width="12%" sx={{ textAlign: 'center' }}>
          <Chip
            label={user.isRegisterSelling ? 'Yes' : 'No'}
            sx={{
              bgcolor: user.isRegisterSelling ? 'rgba(76, 175, 80, 0.2)' : 'rgba(117, 117, 117, 0.2)',
              color: user.isRegisterSelling ? '#4CAF50' : '#757575',
              border: `1px solid ${user.isRegisterSelling ? '#4CAF50' : '#757575'}`,
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
                      <Typography sx={{ color: 'white' }}>User ID: {user._id || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>User Name: {user.userName || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>Full Name: {user.fullName || 'Not provided'}</Typography>
                      <Typography sx={{ color: 'white' }}>Email: {user.email || 'N/A'}</Typography>
                      <Typography sx={{ color: 'white' }}>Phone: {user.phoneNumber || 'Not provided'}</Typography>
                      <Typography sx={{ color: 'white' }}>Address: {user.address || 'Not provided'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, height: '100%' }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>Account Details</Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>Role: {roleConfig.label}</Typography>
                      <Typography sx={{ color: 'white' }}>Verification Status: {verifyConfig.label}</Typography>
                      <Typography sx={{ color: 'white' }}>
                        Seller Status: {user.isRegisterSelling ? 'Registered as Seller' : 'Not a Seller'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>Remaining Credits: {user.remainingCredits || 0}</Typography>
                      <Typography sx={{ color: 'white' }}>
                        Created: {formatDate(user.createdAt)}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Last Updated: {formatDate(user.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: 2
          }
        }}
        aria-labelledby="update-dialog-title"
        keepMounted
      >
        <DialogTitle id="update-dialog-title" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
          Update Account Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
            Update status for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName || 'Unknown User'}</span>
          </DialogContentText>
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' } }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Verification Status</InputLabel>
            <Select
              value={newVerifyStatus}
              onChange={handleVerifyStatusChange}
              label="Verification Status"
              sx={{ color: 'white' }}
            >
              <MenuItem value={0}>Unverified</MenuItem>
              <MenuItem value={1}>Verified</MenuItem>
              <MenuItem value={2}>Banned</MenuItem>
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
            disabled={isLoading || newVerifyStatus === user.verify}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: 2
          }
        }}
        aria-labelledby="confirm-dialog-title"
        keepMounted
      >
        <DialogTitle id="confirm-dialog-title" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to change the status to{' '}
            <span style={{ color: getVerifyConfig(newVerifyStatus).color, fontWeight: 'bold' }}>
              {getVerifyConfig(newVerifyStatus).label}
            </span>
            {' '}for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName || 'Unknown User'}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            sx={{
              backgroundColor: getVerifyConfig(newVerifyStatus).color,
              color: 'white',
              '&:hover': { backgroundColor: `${getVerifyConfig(newVerifyStatus).color}CC` }
            }}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          >
            Confirm
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
      if (response?.result && Array.isArray(response.result)) {
        const validatedUsers = response.result.map(user => ({
          ...user,
          verify: user.verify?.verify !== undefined ? user.verify.verify : (typeof user.verify === 'number' ? user.verify : 0)
        }));
        setUsers(validatedUsers);
      } else {
        setUsers([]);
        toast.warn('Unexpected response format from server');
        console.warn('Unexpected API response format:', response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.userName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber || '').includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === Number(roleFilter);
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = page * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
            <MenuItem value={0}>Admin</MenuItem>
            <MenuItem value={1}>User</MenuItem>
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