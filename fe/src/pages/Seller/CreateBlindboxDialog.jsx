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

const CreateBlindboxDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: '',
    brand: '',
    size: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalImage(file);
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
      console.error('Error removing background:', error);
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      setSubmitting(true);

      // First upload the image
      setUploading(true);
      const imageResponse = await uploadImage(selectedFile);
      setUploading(false);

      // Then create the product with the image URL
      const productData = {
        ...formData,
        size: parseFloat(formData.size),
        price: parseFloat(formData.price),
        image: imageResponse.result // Assuming the API returns a URL in the response
      };

      await createBlindbox(productData);

      toast.success('Product created successfully');
      onSuccess(); // Call the success callback to refresh products
      handleClose(); // Close the dialog
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: '',
      brand: '',
      size: '',
      image: ''
    });
    setSelectedFile(null);
    setImagePreview('');
    setOriginalImage(null);
    onClose(); // Call the parent's onClose function
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
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
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
                    variant="determinate"
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
                onChange={handleFileChange}
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

          </Grid>

          {/* Form Fields Column - Right Side */}
          <Grid item xs={12} md={6} container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="brand"
                label="Brand"
                variant="outlined"
                fullWidth
                value={formData.brand}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="price"
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Quantity: {formData.quantity || 1}
              </Typography>
              <Slider
                name="quantity"
                value={formData.quantity || 1}
                onChange={(e, newValue) => handleInputChange({ target: { name: 'quantity', value: newValue } })}
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

            </Grid>
            <Grid item xs={12}>
              <TextField
                name="size"
                label="Size"
                variant="outlined"
                type="number"
                fullWidth
                value={formData.size}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
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
              onClick={handleSubmit}
              disabled={submitting || uploading || isRemovingBg}
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
              {uploading ? 'Uploading Image...' : submitting ? 'Creating...' : 'Create Product'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBlindboxDialog;