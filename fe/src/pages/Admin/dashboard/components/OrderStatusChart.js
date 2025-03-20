import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';


// Define status colors
const statusColors = {
  'Pending': '#FFB74D', // orange
  'Processing': '#42A5F5', // blue
  'Confirmed': '#26C6DA', // cyan
  'Completed': '#66BB6A', // green
  'Cancelled': '#EF5350', // red
  'Other': '#9E9E9E' // grey
};

export default function OrderStatusChart({ orderData }) {
  const theme = useTheme();
  const statuses = orderData?.byStatus || {};
  
  // Transform data for the pie chart
  const chartData = Object.entries(statuses).map(([status, count]) => ({
    id: status,
    label: status === 'undefined' || status === 'null' ? 'Other' : status,
    value: count,
    color: statusColors[status === 'undefined' || status === 'null' ? 'Other' : status] || '#9E9E9E'
  }));
  
  // Calculate total orders from statuses
  const totalFromStatuses = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // If no data, show a message
  if (chartData.length === 0 || totalFromStatuses === 0) {
    return (
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" sx={{ mb: 2 }}>
            Order Status Breakdown
          </Typography>
          <NoDataMessage message="No order status data available" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Order Status Breakdown
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
          {/* Pie Chart */}
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 1,
                cornerRadius: 5,
                highlightScope: { faded: 'global', highlighted: 'item' },
                arcLabel: (item) => `${Math.round((item.value / totalFromStatuses) * 100)}%`,
                arcLabelMinAngle: 10,
              
              }
            ]}
            height={250}
            width={350}
            margin={{ right: 5 }}
            legend={{ hidden: true }}
          />
          
          {/* Legend */}
          <Stack 
            direction="row" 
            spacing={1} 
            useFlexGap 
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {chartData.map((status) => (
              <Chip
                key={status.id}
                label={`${status.label}: ${status.value}`}
                size="small"
                sx={{
                  backgroundColor: status.color,
                  color: theme.palette.getContrastText(status.color),
                  fontWeight: 500,
                  mb: 1
                }}
              />
            ))}
          </Stack>
          
          <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', textAlign: 'center' }}>
            Total Orders: {totalFromStatuses}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Simple component to display when no data is available
function NoDataMessage({ message }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 250,
        flexDirection: 'column',
        color: 'text.secondary',
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
} 