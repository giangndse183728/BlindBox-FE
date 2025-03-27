import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getPromotions, createPromotions, updatePromotions, deletePromotions } from '../../../../services/promoApi';

const ManagePromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        discountRate: '',
        startDate: '',
        endDate: '',
        sellerId: '',
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await getPromotions();
            setPromotions(Array.isArray(response.data) ? response.data : []);

            console.log('Promotions response:', response);
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
        try {
            await createPromotions(formData);
            showSnackbar('Promotion created successfully');
            setOpenModal(false);
            resetForm();
            fetchPromotions();
        } catch (error) {
            showSnackbar('Failed to create promotion', 'error');
            console.error('Error creating promotion:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updatePromotions(editingId, formData);
            showSnackbar('Promotion updated successfully');
            setOpenModal(false);
            resetForm();
            fetchPromotions();
        } catch (error) {
            showSnackbar('Failed to update promotion', 'error');
            console.error('Error updating promotion:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePromotions(id);
            showSnackbar('Promotion deleted successfully');
            fetchPromotions();
        } catch (error) {
            showSnackbar('Failed to delete promotion', 'error');
            console.error('Error deleting promotion:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            discountRate: '',
            startDate: '',
            endDate: '',
            sellerId: '',
            isActive: true
        });
        setEditingId(null);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Discount Rate',
            dataIndex: 'discountRate',
            key: 'discountRate',
            render: (rate) => `${rate}%`,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Seller ID',
            dataIndex: 'sellerId',
            key: 'sellerId',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Box
                    component="span"
                    sx={{
                        color: isActive ? 'success.main' : 'error.main',
                        bgcolor: isActive ? 'success.lighter' : 'error.lighter',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                    }}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Manage Promotions</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                >
                    Add New Promotion
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Discount Rate</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Seller ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : promotions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No promotions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            promotions.map((promotion) => (
                                <TableRow key={promotion._id}>
                                    <TableCell>{promotion.name}</TableCell>
                                    <TableCell>{`${promotion.discountRate}%`}</TableCell>
                                    <TableCell>{promotion.startDate}</TableCell>
                                    <TableCell>{promotion.endDate}</TableCell>
                                    <TableCell>{promotion.sellerId}</TableCell>
                                    <TableCell>
                                        <Box
                                            component="span"
                                            sx={{
                                                color: promotion.isActive ? 'success.main' : 'error.main',
                                                bgcolor: promotion.isActive ? 'success.lighter' : 'error.lighter',
                                                px: 2,
                                                py: 0.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            {promotion.isActive ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setEditingId(promotion._id);
                                                setFormData(promotion);
                                                setOpenModal(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(promotion._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openModal} onClose={() => {
                setOpenModal(false);
                resetForm();
            }}>
                <DialogTitle>{editingId ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Promotion Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Discount Rate (%)"
                            type="number"
                            value={formData.discountRate}
                            onChange={(e) => setFormData({ ...formData, discountRate: e.target.value })}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Seller ID"
                            value={formData.sellerId}
                            onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenModal(false);
                        resetForm();
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={editingId ? handleUpdate : handleCreate}
                    >
                        {editingId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManagePromotions;