import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function SessionsChart({ data = [] }) {
  const theme = useTheme();
  
  // Format dates for x-axis
  const dates = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  // Get orders data
  const ordersData = data.map(item => item.orders);
  
  // Get revenue data (multiplied by 100 for better visualization if all zeros)
  const revenueData = data.map(item => item.revenue || item.orders * 100);
  
  // Calculate total orders
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  
  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  
  // Calculate trend (comparing first and last day)
  const trend = data.length >= 2 ? 
    (data[data.length-1].orders > data[0].orders ? '+' : '-') + 
    Math.round(Math.abs((data[data.length-1].orders / Math.max(data[0].orders, 1) - 1) * 100)) + '%' : 
    '+0%';

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Order Activity
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalOrders}
            </Typography>
            <Chip 
              size="small" 
              color={trend.startsWith('+') ? 'success' : 'error'} 
              label={trend} 
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Orders per day for the recent period
          </Typography>
        </Stack>
        
        {data.length > 0 ? (
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'point',
                data: dates,
                tickInterval: (index, i) => (i + 1) % Math.max(1, Math.floor(dates.length / 5)) === 0,
              },
            ]}
            series={[
              {
                id: 'orders',
                label: 'Orders',
                showMark: true,
                curve: 'linear',
                data: ordersData,
                area: true,
              },
              {
                id: 'revenue',
                label: 'Revenue',
                showMark: false,
                curve: 'linear',
                data: revenueData,
                area: true,
              },
            ]}
            height={250}
            margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiAreaElement-series-orders': {
                fill: "url('#orders')",
              },
              '& .MuiAreaElement-series-revenue': {
                fill: "url('#revenue')",
              },
            }}
            slotProps={{
              legend: {
                position: {
                  vertical: 'top',
                  horizontal: 'right',
                },
              },
            }}
          >
            <AreaGradient color={theme.palette.primary.main} id="orders" />
            <AreaGradient color={theme.palette.primary.dark} id="revenue" />
          </LineChart>
        ) : (
          <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No data available for the selected period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

SessionsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      orders: PropTypes.number.isRequired,
      revenue: PropTypes.number,
    })
  ),
};
