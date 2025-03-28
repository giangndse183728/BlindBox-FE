import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, IconButton, TextField,
    InputAdornment, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, Chip, FormControlLabel, Switch, TablePagination,
    DialogContentText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPromotions, createPromotions, updatePromotions, deletePromotions } from '../../../../services/promoApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <DialogContent sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {message}
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

const ManagePromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
    const [formData, setFormData] = useState({
        name: '',
        discountRate: 10,
        startDate: '',
        endDate: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await getPromotions();
            setPromotions(response.result || []);
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setPromotions([]);
            showSnackbar('Failed to fetch promotions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCreate = async () => {
        // Add date validation
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const startDateObj = new Date(formData.startDate).setHours(0, 0, 0, 0);
        const endDateObj = new Date(formData.endDate).setHours(0, 0, 0, 0);

        if (startDateObj < currentDate) {
            toast.error('Start date cannot be before today', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }

        if (endDateObj < currentDate) {
            toast.error('End date cannot be before today', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }

        if (endDateObj < startDateObj) {
            toast.error('End date must be after start date', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }

        try {
            await createPromotions(formData);
            setOpenModal(false);
            resetForm();
            fetchPromotions();
            toast.success('Discount created successfully', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        } catch (error) {
            console.error('Error creating discount:', error);
            toast.error('Failed to create discount', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    const handleDelete = (id) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true);
            await deletePromotions(deletingId);
            setDeleteDialogOpen(false);
            toast.success('Discount deleted successfully', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            fetchPromotions();
        } catch (error) {
            console.error('Error deleting discount:', error);
            toast.error('Failed to delete discount', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        } finally {
            setIsLoading(false);
            setDeletingId(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            discountRate: 10,
            startDate: '',
            endDate: ''
        });
    };

    const filteredPromotions = promotions.filter(promo =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusUpdate = async (promotionId, newStatus) => {
        try {
            await updatePromotions(promotionId, { isActive: newStatus });
            setPromotions(prevPromotions =>
                prevPromotions.map(promo =>
                    promo._id === promotionId ? { ...promo, isActive: newStatus } : promo
                )
            );
            toast.success(`Discount ${newStatus ? 'activated' : 'deactivated'} successfully`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (error) {
            console.error('Error updating discount status:', error);
            toast.error('Failed to update discount status', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate paginated data
    const paginatedPromotions = filteredPromotions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', textAlign: 'center' }}>
                Manage Discounts 🎉
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
            }}>
                <TextField
                    placeholder="Search discounts..."
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

                <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    sx={{
                        backgroundColor: '#FFD700',
                        color: 'black',
                        '&:hover': { backgroundColor: '#E6C200' },
                        minWidth: '200px'
                    }}
                >
                    Create Discount
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress sx={{ color: '#FFD700' }} />
                </Box>
            ) : (
                <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            width: '25%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif"
                                        }}
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '10%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif"
                                        }}
                                    >
                                        Discount
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '15%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif",
                                            display: { xs: 'none', md: 'table-cell' } // Hide on mobile
                                        }}
                                    >
                                        Start Date
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '15%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif",
                                            display: { xs: 'none', md: 'table-cell' } // Hide on mobile
                                        }}
                                    >
                                        End Date
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '15%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif"
                                        }}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '15%',
                                            color: 'white',
                                            fontFamily: "'Jersey 15', sans-serif",
                                            textAlign: 'center'
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPromotions.map((promotion) => (
                                    <TableRow key={promotion._id}>
                                        <TableCell sx={{
                                            color: 'white',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {promotion.name}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {`${promotion.discountRate}%`}
                                        </TableCell>
                                        <TableCell sx={{
                                            color: 'white',
                                            display: { xs: 'none', md: 'table-cell' } // Hide on mobile
                                        }}>
                                            {new Date(promotion.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell sx={{
                                            color: 'white',
                                            display: { xs: 'none', md: 'table-cell' } // Hide on mobile
                                        }}>
                                            {new Date(promotion.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={promotion.isActive ? 'Active' : 'Inactive'}
                                                sx={{
                                                    bgcolor: promotion.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                                    color: promotion.isActive ? '#4CAF50' : '#F44336',
                                                    border: `1px solid ${promotion.isActive ? '#4CAF50' : '#F44336'}`,
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                    height: '24px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 0.5,
                                                alignItems: 'center'
                                            }}>
                                                <Switch
                                                    checked={promotion.isActive}
                                                    onChange={(e) => handleStatusUpdate(promotion._id, e.target.checked)}
                                                    size="small"
                                                    sx={{
                                                        transform: 'scale(0.8)',
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#FFD700',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 215, 0, 0.08)',
                                                            },
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#FFD700',
                                                        },
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => handleDelete(promotion._id)}
                                                    size="small"
                                                    sx={{
                                                        padding: '4px',
                                                        color: '#F44336',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {paginatedPromotions.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                            sx={{ color: 'white' }}
                                        >
                                            No discounts found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredPromotions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5]} // Lock to 5 rows per page
                        sx={{
                            color: 'white',
                            '.MuiTablePagination-toolbar': {
                                color: 'white',
                            },
                            '.MuiTablePagination-selectIcon': {
                                color: 'white',
                            },
                            '.MuiTablePagination-displayedRows': {
                                color: 'white',
                            },
                            '.MuiTablePagination-actions': {
                                color: 'white',
                                '& .MuiIconButton-root': {
                                    color: 'white',
                                    '&.Mui-disabled': {
                                        color: 'rgba(255, 255, 255, 0.3)',
                                    },
                                },
                            },
                        }}
                    />
                </Paper>
            )}

            <Dialog
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    resetForm();
                }}
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
                    {editingId ? 'Edit Discount' : 'Create New Discount'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, minWidth: '400px' }}>
                        <TextField
                            label="Discount Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#FFD700' },
                                },
                            }}
                        />
                        <TextField
                            label="Discount Rate (%)"
                            type="number"
                            value={formData.discountRate}
                            onChange={(e) => setFormData({ ...formData, discountRate: Number(e.target.value) })}
                            fullWidth
                            required
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#FFD700' },
                                },
                            }}
                        />
                        <TextField
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0]
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#FFD700' },
                                },
                            }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: formData.startDate || new Date().toISOString().split('T')[0]
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#FFD700' },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => {
                            setOpenModal(false);
                            resetForm();
                        }}
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
                        onClick={handleCreate}
                        sx={{
                            backgroundColor: '#FFD700',
                            color: 'black',
                            '&:hover': { backgroundColor: '#E6C200' }
                        }}
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Are you sure you want to delete this discount?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                        variant="outlined"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        sx={{
                            backgroundColor: '#F44336',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#d32f2f'
                            }
                        }}
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
                style={{ zIndex: 9999 }}
            />
        </Box>
    );
};

export default ManagePromotions;