import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Grid, CircularProgress, DialogTitle, 
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ButtonCus from "../../components/Button/ButtonCus";
import { createOpenItem, uploadImage } from '../../services/productApi';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// Validation schema for open item
const openItemSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .typeError('Quantity must be a number'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
  brand: Yup.string()
    .required('Brand is required')
    .min(1, 'Brand must be at least 1 character')
    .max(50, 'Brand cannot exceed 50 characters'),
  condition: Yup.number()
    .required('Condition is required')
    .min(1, 'Condition must be between 1-5')
    .max(5, 'Condition must be between 1-5')
    .integer('Condition must be a whole number')
    .typeError('Condition must be a number')
});

const CONDITION_LABELS = {
  1: { label: 'Poor', color: '#F44336' },
  2: { label: 'Fair', color: '#FF9800' },
  3: { label: 'Good', color: '#FFC107' },
  4: { label: 'Very Good', color: '#8BC34A' },
  5: { label: 'Excellent', color: '#4CAF50' }
};

const CreateOpenItemDialog = ({ open, onClose, onSuccess }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Save the file for later upload during submission
    setSelectedFile(file);
    
    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!selectedFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      setSubmitting(true);
      
      // First upload the image
      console.log("Starting image upload...");
      setUploadingImage(true);
      const uploadResponse = await uploadImage(selectedFile);
      setUploadingImage(false);
      
      if (!uploadResponse || !uploadResponse.result || !uploadResponse.result) {
        throw new Error('Failed to upload image');
      }
      
      const imageUrl = uploadResponse.result;
      console.log("Image uploaded successfully, URL:", imageUrl);
      
      // Then create the item with the image URL
      const itemData = {
        ...values,
        image: imageUrl
      };
      
      console.log("Creating open item with data:", itemData);
      const createResponse = await createOpenItem(itemData);
      console.log("Create open item response:", createResponse);
      
      // Handle success
      toast.success('Item added to inventory');
      resetForm();
      setPreviewImage('');
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error.message || 'Failed to create item');
    } finally {
      setSubmitting(false);
    }
  };

  // Close and reset dialog
  const handleClose = () => {
    setPreviewImage('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <>
      <DialogTitle sx={{
        color: '#FFD700',
        fontFamily: "'Jersey 15', sans-serif",
        borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
        pb: 2
      }}>
        Add New Item to Inventory
      </DialogTitle>
      <Formik
        initialValues={{
          name: '',
          description: '',
          quantity: 1,
          price: '',
          brand: '',
          condition: 3
        }}
        validationSchema={openItemSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, touched, values }) => (
          <Form>
            <DialogContent sx={{ py: 3 }}>
              <Grid container spacing={3}>
                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      border: '2px dashed rgba(255, 215, 0, 0.3)',
                      height: '300px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {previewImage ? (
                      <Box
                        component="img"
                        src={previewImage}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
                        Click to upload an image
                      </Typography>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                      disabled={uploadingImage || isSubmitting}
                    />
                    
                    {uploadingImage && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }}
                      >
                        <CircularProgress sx={{ color: '#FFD700' }} />
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Form Fields */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    {/* Name */}
                    <Grid item xs={12}>
                      <Field name="name">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Item Name"
                            fullWidth
                            error={meta.touched && meta.error ? true : false}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            FormHelperTextProps={{ sx: { color: '#F44336' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    
                    {/* Brand */}
                    <Grid item xs={12} sm={6}>
                      <Field name="brand">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Brand"
                            fullWidth
                            error={meta.touched && meta.error ? true : false}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            FormHelperTextProps={{ sx: { color: '#F44336' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    
                    {/* Condition */}
                    <Grid item xs={12} sm={6}>
                      <Field name="condition">
                        {({ field, meta }) => (
                          <FormControl fullWidth error={meta.touched && meta.error ? true : false}>
                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Condition
                            </InputLabel>
                            <Select
                              {...field}
                              label="Condition"
                              sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { 
                                  borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' 
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': { 
                                  borderColor: 'rgba(255, 255, 255, 0.5)' 
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                                  borderColor: '#FFD700' 
                                }
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                  }
                                }
                              }}
                            >
                              {Object.entries(CONDITION_LABELS).map(([value, { label, color }]) => (
                                <MenuItem key={value} value={Number(value)} sx={{ color: 'white' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ 
                                      width: 12, 
                                      height: 12, 
                                      borderRadius: '50%', 
                                      backgroundColor: color,
                                      mr: 1 
                                    }} />
                                    {label}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <Typography sx={{ color: '#F44336', fontSize: '0.75rem', mt: 0.5 }}>
                                {meta.error}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>
                    
                    {/* Price */}
                    <Grid item xs={12} sm={6}>
                      <Field name="price">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Price"
                            fullWidth
                            type="number"
                            inputProps={{ step: "0.01" }}
                            error={meta.touched && meta.error ? true : false}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            FormHelperTextProps={{ sx: { color: '#F44336' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start" sx={{ color: 'white' }}>$</InputAdornment>,
                              sx: { color: 'white' }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    
                    {/* Quantity */}
                    <Grid item xs={12} sm={6}>
                      <Field name="quantity">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Quantity"
                            fullWidth
                            type="number"
                            error={meta.touched && meta.error ? true : false}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            FormHelperTextProps={{ sx: { color: '#F44336' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    
                    {/* Description */}
                    <Grid item xs={12}>
                      <Field name="description">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            error={meta.touched && meta.error ? true : false}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            FormHelperTextProps={{ sx: { color: '#F44336' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
              <Button 
                onClick={handleClose}
                sx={{ 
                  color: '#FFD700',
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.08)'
                  }
                }}
                variant="outlined"
                disabled={isSubmitting || uploadingImage}
              >
                Cancel
              </Button>
              <ButtonCus
                variant="button-pixel-green"
                width="150px"
                height="40px"
                type="submit"
                disabled={isSubmitting || uploadingImage}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {(isSubmitting) ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <AddIcon />
                  )}
                  <Typography fontFamily="'Jersey 15', sans-serif" color="white">
                    {isSubmitting ? 'Adding...' : 'Add Item'}
                  </Typography>
                </Box>
              </ButtonCus>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateOpenItemDialog; 