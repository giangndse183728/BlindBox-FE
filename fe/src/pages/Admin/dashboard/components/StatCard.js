import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { alpha } from '@mui/material/styles';

function StatCard({ title, value, interval, trend }) {
  const theme = useTheme();

  // Define trend colors and icons
  const trendConfig = {
    up: {
      color: theme.palette.success.main,
      colorLight: alpha(theme.palette.success.main, 0.12),
      icon: <ArrowUpwardIcon fontSize="small" />,
      chipColor: 'success',
      label: '+25%'
    },
    down: {
      color: theme.palette.error.main,
      colorLight: alpha(theme.palette.error.main, 0.12),
      icon: <ArrowDownwardIcon fontSize="small" />,
      chipColor: 'error',
      label: '-25%'
    },
    neutral: {
      color: theme.palette.grey[500],
      colorLight: alpha(theme.palette.grey[500], 0.12),
      icon: <RemoveIcon fontSize="small" />,
      chipColor: 'default',
      label: '+5%'
    }
  };

  // Choose icon based on title
  const getIconForTitle = (title) => {
    if (title.toLowerCase().includes('product')) return <ShoppingBagIcon />;
    if (title.toLowerCase().includes('order')) return <ShoppingCartIcon />;
    if (title.toLowerCase().includes('user')) return <PeopleAltIcon />;
    return <ShoppingBagIcon />;
  };

  // Get current trend configuration
  const currentTrend = trendConfig[trend];

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        position: 'relative',
        overflow: 'visible',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      {/* Background decoration */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: `radial-gradient(circle at 100% 0%, ${alpha(currentTrend.color, 0.08)} 0%, transparent 70%)`,
          zIndex: 0,
          borderRadius: 'inherit'
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography 
            component="h2" 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {title}
          </Typography>
          
          <Avatar 
            sx={{ 
              bgcolor: currentTrend.colorLight, 
              color: currentTrend.color,
              width: 40,
              height: 40
            }}
          >
            {getIconForTitle(title)}
          </Avatar>
        </Stack>
        
        <Stack spacing={1}>
          <Typography 
            variant="h3" 
            component="p" 
            sx={{ 
              fontWeight: 700,
              fontSize: '2rem',
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
          >
            <Chip 
              size="small" 
              icon={currentTrend.icon} 
              label={currentTrend.label} 
              color={currentTrend.chipColor}
              sx={{ 
                height: 24,
                '& .MuiChip-icon': { fontSize: 16 },
                fontWeight: 500
              }}
            />
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                ml: 1
              }}
            >
              {interval}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  interval: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']).isRequired,
  value: PropTypes.string.isRequired,
  // Remove data prop since we're not using the chart anymore
};

export default StatCard;
