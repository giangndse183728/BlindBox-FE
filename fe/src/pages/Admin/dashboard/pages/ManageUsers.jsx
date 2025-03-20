import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Chip, Grid, Pagination, Stack, TableFooter, Button, Dialog, DialogActions,
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

// User role and verification status config
const USER_ROLES = {
  0: { label: 'User', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)' },
  1: { label: 'Admin', color: '#f57c00', bgColor: 'rgba(245, 124, 0, 0.2)' },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)' }
};

const VERIFY_STATUS = {
  0: { label: 'Not Verified', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Verified', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <VerifiedIcon /> },
  2: { label: 'Banned', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <DeleteIcon /> },
  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
};

function UserRow({ user, refreshUsers }) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newVerifyStatus, setNewVerifyStatus] = useState(user?.verify);
  const [newRole, setNewRole] = useState(user?.role);
  const [loading, setLoading] = useState(false);

  const openActions = Boolean(anchorEl);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleConfig = (role) => {
    return USER_ROLES[role] || USER_ROLES.default;
  };

  const getVerifyConfig = (verifyStatus) => {
    return VERIFY_STATUS[verifyStatus] || VERIFY_STATUS.default;
  };

  const handleActionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

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
      setLoading(true);
      await deleteAdminAccount(user._id);
      setDeleteDialogOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfirm = async () => {
    try {
      setLoading(true);
      await updateAdminAccount(user._id, {
        verifyStatus: newVerifyStatus
      });
      setUpdateDialogOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Failed to update account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="60px">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'white' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width="18%" sx={{ color: 'white' }}>{user?.userName || 'N/A'}</TableCell>
        <TableCell width="22%" sx={{ color: 'white' }}>{user?.email || 'N/A'}</TableCell>
        <TableCell width="15%" sx={{ color: 'white' }}>{user?.phoneNumber || 'N/A'}</TableCell>
        <TableCell width="15%" sx={{ textAlign: 'center' }}>
          {user && (
            <Chip
              label={getRoleConfig(user.role).label}
              sx={{
                bgcolor: getRoleConfig(user.role).bgColor,
                color: getRoleConfig(user.role).color,
                border: `1px solid ${getRoleConfig(user.role).color}`,
                fontWeight: 'bold',
                maxWidth: '100%'
              }}
            />
          )}
        </TableCell>
        <TableCell width="15%" sx={{ textAlign: 'center' }}>
          {user && (
            <Chip
              label={getVerifyConfig(user.verify).label}
              sx={{
                bgcolor: getVerifyConfig(user.verify).bgColor,
                color: getVerifyConfig(user.verify).color,
                border: `1px solid ${getVerifyConfig(user.verify).color}`,
                fontWeight: 'bold',
                maxWidth: '100%',
                width: '120px',
                justifyContent: 'center'
              }}
              icon={
                <Box sx={{
                  '& svg': {
                    color: getVerifyConfig(user.verify).color,
                    fontSize: '1rem',
                    mr: -0.5
                  }
                }}>
                  {getVerifyConfig(user.verify).icon}
                </Box>
              }
            />
          )}
        </TableCell>
        <TableCell width="15%" sx={{ textAlign: 'center' }}>
          {user?.isRegisterSelling ? (
            <Chip
              label="Yes"
              sx={{
                bgcolor: 'rgba(76, 175, 80, 0.2)',
                color: '#4CAF50',
                border: '1px solid #4CAF50',
                fontWeight: 'bold',
                maxWidth: '100%'
              }}
            />
          ) : (
            <Chip
              label="No"
              sx={{
                bgcolor: 'rgba(117, 117, 117, 0.2)',
                color: '#757575',
                border: '1px solid #757575',
                fontWeight: 'bold',
                maxWidth: '100%'
              }}
            />
          )}
        </TableCell>
        <TableCell width="10%" sx={{ textAlign: 'center' }}>
          <IconButton
            aria-label="more actions"
            size="small"
            onClick={handleActionsClick}
            sx={{ color: 'white' }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="actions-menu"
            anchorEl={anchorEl}
            open={openActions}
            onClose={handleActionsClose}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 1,
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={handleUpdateClick}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <EditIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#2196F3' }} />
              Update Status
            </MenuItem>
            <MenuItem
              onClick={handleDeleteClick}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#F44336' }} />
              Delete Account
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                User Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Account Information
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>
                        User ID: {user?._id || 'N/A'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        User Name: {user?.userName || 'N/A'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Full Name: {user?.fullName || 'Not provided'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Email: {user?.email || 'N/A'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Phone: {user?.phoneNumber || 'Not provided'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Address: {user?.address || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Account Details
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>
                        Role: {getRoleConfig(user?.role).label}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Verification Status: {getVerifyConfig(user?.verify).label}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Seller Status: {user?.isRegisterSelling ? 'Registered as Seller' : 'Not a Seller'}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Remaining Credits: {user?.remainingCredits || 0}
                      </Typography>
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
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete the account for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName}</span>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: '#F44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
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
          Update Account Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
            Update verification status for <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.userName}</span>
          </DialogContentText>

          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Verification Status</InputLabel>
            <Select
              value={newVerifyStatus}
              onChange={(e) => setNewVerifyStatus(e.target.value)}
              label="Verification Status"
              sx={{ color: 'white' }}
            >
              <MenuItem value={0}>Not Verified</MenuItem>
              <MenuItem value={1}>Verified</MenuItem>
              <MenuItem value={2}>Banned</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>User Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="User Role"
              sx={{ color: 'white' }}
            >
              <MenuItem value={0}>User</MenuItem>
              <MenuItem value={1}>Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setUpdateDialogOpen(false)}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateConfirm}
            sx={{
              backgroundColor: '#2196F3',
              color: 'white',
              '&:hover': { backgroundColor: '#1976d2' }
            }}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminAccounts();
      if (response.result) {
        setUsers(response.result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery)
    );
    const matchesRole = roleFilter === 'all' || user.role === parseInt(roleFilter);
    return matchesSearch && matchesRole;
  });

  // Get current page of users
  const indexOfLastUser = page * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Add refreshUsers function to be passed to UserRow
  const refreshUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminAccounts();
      if (response.result) {
        setUsers(response.result);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', textAlign: 'center' }}>
        Manage Users 👥
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
      }}>
        <TextField
          placeholder="Search by username, email or phone"
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
            id="role-filter-label"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': { color: '#FFD700' }
            }}
          >
            Role
          </InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Role"
            IconComponent={FilterListIcon}
            sx={{ color: 'white' }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="0">User</MenuItem>
            <MenuItem value="1">Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
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
            <Table
              sx={{
                tableLayout: 'fixed',
                width: '100%'
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell width="60px" />
                  <TableCell width="15%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Username</TableCell>
                  <TableCell width="22%" sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Email</TableCell>
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

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 1,
              p: 2
            }}
          >
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
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }
                }}
              />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}
