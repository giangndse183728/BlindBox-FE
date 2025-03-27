import React from 'react';
import { 
  Box, Typography, TextField, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { toast } from 'react-toastify';
import ButtonCus from "../../components/Button/ButtonCus";
import { createFeedback } from '../../services/feedbackApi';
import { Formik, Form, Field } from 'formik';
import { feedbackSchema } from '../../utils/validationSchemas';

const ProductFeedbackForm = ({ 
  open, 
  onClose, 
  orderId, 
  product, 
  onSuccess
}) => {
  // Initial values for the form
  const initialValues = {
    rate: 5,
    content: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!product) {
      toast.error('No product selected for feedback');
      setSubmitting(false);
      return;
    }

    try {
      const feedbackData = {
        orderId,
        productId: product.productId,
        rate: Number(values.rate),
        content: values.content
      };

      await createFeedback(feedbackData);
      toast.success('Thank you for your feedback!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  // Custom star rating component for Formik
  const StarRating = ({ field, form }) => {
    const handleRateChange = (newRate) => {
      form.setFieldValue(field.name, Number(newRate));
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 3,
        color: '#FFD700'
      }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton 
            key={star} 
            onClick={() => handleRateChange(star)}
            sx={{ p: 1 }}
          >
            {star <= field.value ? 
              <StarIcon sx={{ fontSize: '2rem', color: '#FFD700' }} /> : 
              <StarBorderIcon sx={{ fontSize: '2rem', color: '#FFD700' }} />
            }
          </IconButton>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 2,
          maxWidth: '500px',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{
        color: '#FFD700',
        fontFamily: "'Jersey 15', sans-serif",
        borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
        pb: 2
      }}>
        Rate This Product
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={feedbackSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <DialogContent sx={{ py: 3 }}>
              <Typography sx={{ color: 'white', mb: 2 }}>
                How would you rate your experience with this product?
              </Typography>
              
              {/* Star Rating */}
              <Field 
                name="rate" 
                component={StarRating} 
              />
              {errors.rate && touched.rate && (
                <Typography sx={{ color: '#F44336', textAlign: 'center', mb: 2, fontSize: '0.8rem' }}>
                  {errors.rate}
                </Typography>
              )}
              
              {/* Feedback Text */}
              <Field name="content">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    label="Your Review"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Share your experience with this product..."
                    error={meta.touched && meta.error ? true : false}
                    helperText={meta.touched && meta.error ? meta.error : ''}
                    FormHelperTextProps={{ 
                      sx: { 
                        color: '#F44336', 
                        fontWeight: 'bold'
                      } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& fieldset': {
                          borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: meta.touched && meta.error ? '#F44336' : 'rgba(255, 255, 255, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: meta.touched && meta.error ? '#F44336' : '#FFD700'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: meta.touched && meta.error ? '#F44336' : '#FFD700'
                      }
                    }}
                  />
                )}
              </Field>
              
              {/* Product Information */}
              {product && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                  <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                    Product Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      component="img" 
                      src={product.image} 
                      alt={product.productName} 
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} 
                    />
                    <Typography sx={{ color: 'white', fontSize: '1rem' }}>
                      {product.productName}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <ButtonCus
                type="button"
                variant="button-pixel"
                width="120px"
                height="40px"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                  Cancel
                </Typography>
              </ButtonCus>
              <ButtonCus
                type="submit"
                variant="button-pixel-green"
                width="160px"
                height="40px"
                disabled={isSubmitting}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isSubmitting ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                      Submit Review
                    </Typography>
                  )}
                </Box>
              </ButtonCus>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ProductFeedbackForm;