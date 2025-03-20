import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function ProductAlert({ productData }) {
  const inactiveProducts = productData?.inactive || 0;
  const outOfStockProducts = productData?.outOfStock || 0;
  const totalProducts = productData?.total || 0;
  
  const percentInactive = totalProducts > 0 
    ? Math.round((inactiveProducts / totalProducts) * 100) 
    : 0;
  
  const percentOutOfStock = totalProducts > 0 
    ? Math.round((outOfStockProducts / totalProducts) * 100) 
    : 0;

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        m: 1.5, 
        flexShrink: 0,
        bgcolor: inactiveProducts > 0 ? 'rgba(255, 242, 230, 0.1)' : undefined,
        borderColor: inactiveProducts > 0 ? 'warning.light' : undefined 
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <WarningAmberIcon 
            color="warning" 
            fontSize="small" 
            sx={{ mr: 1 }} 
          />
          <Typography variant="h6" component="div">
            Product Status Alert
          </Typography>
        </Box>
        
        {!productData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {inactiveProducts + outOfStockProducts > 0 
                ? `You have ${inactiveProducts + outOfStockProducts} products that need attention.`
                : 'All products are active and in stock. No action needed.'}
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {inactiveProducts > 0 
                    ? <HighlightOffIcon color="error" /> 
                    : <CheckCircleOutlineIcon color="success" />}
                </ListItemIcon>
                <ListItemText 
                  primary={`Inactive Products: ${inactiveProducts}`}
                  secondary={`${percentInactive}% of your total products`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  {outOfStockProducts > 0 
                    ? <HourglassEmptyIcon color="warning" /> 
                    : <CheckCircleOutlineIcon color="success" />}
                </ListItemIcon>
                <ListItemText 
                  primary={`Out of Stock: ${outOfStockProducts}`}
                  secondary={`${percentOutOfStock}% of your total products`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary={`Active Products: ${productData.active}`}
                  secondary={`${totalProducts > 0 ? Math.round((productData.active / totalProducts) * 100) : 0}% of your total products`}
                />
              </ListItem>
            </List>
            
            {(inactiveProducts + outOfStockProducts > 0) && (
              <Button
                variant="contained"
                color="warning"
                size="small"
                sx={{ mt: 2 }}
                href="/dashboard/products"
              >
                Review Products
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 