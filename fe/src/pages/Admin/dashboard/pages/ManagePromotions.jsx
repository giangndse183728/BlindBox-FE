import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, IconButton, TextField,
    InputAdornment, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, Chip, FormControlLabel, Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPromotions, createPromotions, updatePromotions, deletePromotions } from '../../../../services/promoApi';

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
        discountRate: 0,
        discountAmount: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: '',
        sellerId: '',
        isActive: true,
        singleUse: false,
        used: false
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updatePromotions(editingId, formData);
            } else {
                await createPromotions(formData);
            }
            showSnackbar('Promotion saved successfully');
            setOpenModal(false);
            resetForm();
            fetchPromotions();
        } catch (error) {
            showSnackbar('Failed to save promotion', 'error');
            console.error('Error saving promotion:', error);
        }
    };

    const handleDelete = async (id) => {
        setConfirmDialog({ open: true, id });
    };

    const confirmDelete = async () => {
        try {
            await deletePromotions(confirmDialog.id);
            showSnackbar('Promotion deleted successfully');
            fetchPromotions();
        } catch (error) {
            showSnackbar('Failed to delete promotion', 'error');
            console.error('Error deleting promotion:', error);
        } finally {
            setConfirmDialog({ open: false, id: null });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            discountRate: 0,
            discountAmount: '',
            maxDiscountAmount: '',
            startDate: '',
            endDate: '',
            sellerId: '',
            isActive: true,
            singleUse: false,
            used: false
        });
        setEditingId(null);
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
        } catch (error) {
            console.error('Error updating promotion status:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', textAlign: 'center' }}>
                Manage Promotions 🎉
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
            }}>
                <TextField
                    placeholder="Search promotions..."
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
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress sx={{ color: '#FFD700' }} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Discount Rate</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Discount Amount</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Max Discount</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Start Date</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>End Date</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPromotions.map((promotion) => (
                                <TableRow key={promotion._id}>
                                    <TableCell sx={{ color: 'white' }}>{promotion.name}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{`${promotion.discountRate}%`}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {promotion.discountAmount ? `$${promotion.discountAmount}` : '-'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {promotion.maxDiscountAmount ? `$${promotion.maxDiscountAmount}` : '-'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>{new Date(promotion.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{new Date(promotion.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={promotion.isActive ? 'Active' : 'Inactive'}
                                            sx={{
                                                bgcolor: promotion.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                                color: promotion.isActive ? '#4CAF50' : '#F44336',
                                                border: `1px solid ${promotion.isActive ? '#4CAF50' : '#F44336'}`,
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                                            <Switch
                                                checked={promotion.isActive}
                                                onChange={(e) => handleStatusUpdate(promotion._id, e.target.checked)}
                                                sx={{
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
                                                sx={{
                                                    color: '#F44336',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmationDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Promotion"
                message="Are you sure you want to delete this promotion?"
            />
        </Box>
    );
};

export default ManagePromotions;