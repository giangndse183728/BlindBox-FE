import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Slider,
  CircularProgress, IconButton, InputAdornment
} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';
import { uploadImage, createBlindbox } from '../../services/productApi';
import { removeBackground } from '@imgly/background-removal';
import CloseIcon from '@mui/icons-material/Close';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Define the validation schema inline to match the exact requirements
const blindboxSchema = Yup.object({
  name: Yup.string()
    .required('Product name is required')
    .min(10, 'NAME_MUST_BE_FROM_10_TO_255')
    .max(255, 'NAME_MUST_BE_FROM_10_TO_255'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'DESCRIPTION_MUST_BE_FROM_10_TO_255')
    .max(255, 'DESCRIPTION_MUST_BE_FROM_10_TO_255'),
  price: Yup.number()
    .required('Price is required')
    .positive('PRICE_MUST_BE_A_POSITIVE_NUMBER')
    .typeError('Price must be a number'),
  brand: Yup.string()
    .required('Brand is required')
    .min(1, 'BRAND_MUST_BE_FROM_1_TO_100')
    .max(100, 'BRAND_MUST_BE_FROM_1_TO_100'),
  size: Yup.number()
    .required('Size is required')
    .positive('SIZE_MUST_BE_POSITIVE_NUMBER')
    .typeError('Size must be a number'),
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('QUANTITY_MUST_BE_A_POSITIVE_INTEGER')
    .positive('QUANTITY_MUST_BE_A_POSITIVE_INTEGER')
    .typeError('Quantity must be a number')
});

const CreateBlindboxDialog = ({ open, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [imageError, setImageError] = useState('');

  const initialValues = {
    name: '',
    description: '',
    quantity: 1,
    price: '',
    brand: '',
    size: '',
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalImage(file);
      setImageError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setIsRemovingBg(true);
   
      const imageUrl = URL.createObjectURL(selectedFile);

      const processedBlob = await removeBackground(imageUrl, {
        model: 'medium', 
        output: {
          format: 'image/png',
          quality: 0.8
        }
      });

      // Create a URL for the processed image
      const processedImageUrl = URL.createObjectURL(processedBlob);

      // Update the preview with the processed image
      setImagePreview(processedImageUrl);

      // Convert blob to File object for upload
      const processedFile = new File([processedBlob], selectedFile.name, {
        type: 'image/png',
        lastModified: new Date().getTime()
      });
      setSelectedFile(processedFile);

      toast.success('Background removed successfully');
    } catch (error) {
      toast.error('Failed to remove background');
      // Revert to original image if there's an error
      if (originalImage) {
        setSelectedFile(originalImage);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(originalImage);
      }
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleRevertToOriginal = () => {
    if (originalImage) {
      setSelectedFile(originalImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(originalImage);
      toast.info('Reverted to original image');
    }
  };

  const handleSubmit = async (values, { setSubmitting: setFormikSubmitting, resetForm }) => {
    if (!selectedFile) {
      setImageError('Please select an image');
      setFormikSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);
   
      setUploading(true);
      const imageResponse = await uploadImage(selectedFile);
      setUploading(false);

      const productData = {
        ...values,
        image: imageResponse.result 
      };

      await createBlindbox(productData);

      toast.success('PRODUCT_CREATED_SUCCESS');
      onSuccess(); 
      resetForm();
      handleClose(); 
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
      setFormikSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImagePreview('');
    setOriginalImage(null);
    setImageError('');
    onClose(); 
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }
      }}
    >
      <DialogTitle variant='h5' sx={{ fontFamily: "'Jersey 15', sans-serif", color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Blindbox ???
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={blindboxSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2} >
                {/* Image Preview Column - Left Side */}
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    border: '1px dashed rgba(255, 215, 0, 0.5)',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    height: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                    position: 'relative'
                  }}>
                    {isRemovingBg && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1,
                        borderRadius: 1
                      }}>
                        <CircularProgress
                          sx={{ color: '#FFD700', mb: 2 }}
                        />
                        <Typography sx={{ color: 'white' }}>
                          Processing...
                        </Typography>
                      </Box>
                    )}

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
                      />
                    ) : (
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Image preview will appear here
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="product-image-upload"
                      type="file"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                    />
                    <label htmlFor="product-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<ImageIcon />}
                        sx={{
                          color: '#FFD700',
                          borderColor: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFD700',
                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          }
                        }}
                      >
                        Upload Image
                      </Button>
                    </label>

                    {imagePreview && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={handleRemoveBackground}
                          disabled={isRemovingBg || !selectedFile}
                          sx={{
                            color: '#FFD700',
                            borderColor: '#FFD700',
                            '&:hover': {
                              borderColor: '#FFD700',
                              backgroundColor: 'rgba(255, 215, 0, 0.1)',
                            }
                          }}
                        >
                          {isRemovingBg ? 'Processing...' : 'Remove Background'}
                        </Button>

                        {originalImage && selectedFile !== originalImage && (
                          <IconButton
                            variant="outlined"
                            onClick={handleRevertToOriginal}
                            sx={{
                              color: 'white',
                              borderColor: 'white',
                              '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              }
                            }}
                          >
                            <SettingsBackupRestoreIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                  {imageError && (
                    <Typography sx={{ color: 'red', mt: 1, textAlign: 'center' }}>
                      {imageError}
                    </Typography>
                  )}
                </Grid>

                {/* Form Fields Column - Right Side */}
                <Grid item xs={12} md={6} container spacing={3}>
                  <Grid item xs={12}>
                    <Field name="name">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Product Name"
                          variant="outlined"
                          fullWidth
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                          }}
                          FormHelperTextProps={{
                            sx: { color: 'red' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FFD700',
                              },
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="brand">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Brand"
                          variant="outlined"
                          fullWidth
                          error={touched.brand && Boolean(errors.brand)}
                          helperText={touched.brand && errors.brand}
                          InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                          }}
                          FormHelperTextProps={{
                            sx: { color: 'red' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FFD700',
                              },
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field name="price">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Price"
                          variant="outlined"
                          fullWidth
                          type="number"
                          error={touched.price && Boolean(errors.price)}
                          helperText={touched.price && errors.price}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ color: 'white' }}>
                                <AttachMoneyIcon />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                          }}
                          FormHelperTextProps={{
                            sx: { color: 'red' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FFD700',
                              },
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Quantity: {values.quantity || 1}
                    </Typography>
                    <Field name="quantity">
                      {({ field }) => (
                        <Slider
                          {...field}
                          value={field.value || 1}
                          onChange={(e, newValue) => setFieldValue('quantity', newValue)}
                          min={1}
                          max={100}
                          step={1}
                          valueLabelDisplay="auto"
                          sx={{
                            color: '#FFD700',
                            '& .MuiSlider-thumb': {
                              backgroundColor: 'white',
                            },
                            '& .MuiSlider-rail': {
                              color: 'rgba(255, 255, 255, 0.3)',
                            },
                          }}
                        />
                      )}
                    </Field>
                    {touched.quantity && errors.quantity && (
                      <Typography sx={{ color: 'red', mt: 1, fontSize: '0.75rem' }}>
                        {errors.quantity}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="size">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Size"
                          variant="outlined"
                          type="number"
                          fullWidth
                          error={touched.size && Boolean(errors.size)}
                          helperText={touched.size && errors.size}
                          InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                          }}
                          FormHelperTextProps={{
                            sx: { color: 'red' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FFD700',
                              },
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="description">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={5}
                          error={touched.description && Boolean(errors.description)}
                          helperText={touched.description && errors.description}
                          InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                          }}
                          FormHelperTextProps={{
                            sx: { color: 'red' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FFD700',
                              },
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
                  *For better visuals, we recommend using the "Remove Background" feature.
                </Typography>

                <Box>
                  <Button onClick={handleClose} sx={{ color: 'white' }}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || uploading || isRemovingBg || isSubmitting}
                    variant="contained"
                    sx={{
                      backgroundColor: '#FFD700',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#E6C200',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        color: 'rgba(0, 0, 0, 0.5)',
                      }
                    }}
                  >
                    {uploading ? 'Uploading Image...' : submitting || isSubmitting ? 'Creating...' : 'Create Product'}
                  </Button>
                </Box>
              </Box>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateBlindboxDialog;