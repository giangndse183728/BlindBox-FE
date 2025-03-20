import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedDataGrid from './CustomizedDataGrid';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import CardAlert from './CardAlert';
import ProductAlert from './ProductAlert';
import OrderStatusChart from './OrderStatusChart';
import { adminApi } from '../../../../services/adminApi';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function MainGrid() {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.fetchDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    getDashboardStats();
  }, []);

  // Generate trend from recent data
  const getTrendFromRecent = (current, previous) => {
    if (!previous || previous === 0) return 'up';
    return current > previous ? 'up' : current < previous ? 'down' : 'neutral';
  };

  // Prepare data for stat cards
  const getStatCards = () => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Active Products',
        value: dashboardData.products.active.toString(),
        interval: 'Current inventory',
        trend: getTrendFromRecent(dashboardData.products.active, dashboardData.products.active - dashboardData.recent.products.new),
      },
      {
        title: 'Total Orders',
        value: dashboardData.orders.total.toString(),
        interval: 'All time',
        trend: 'up',
      },
      {
        title: 'Total Users',
        value: dashboardData.users.total.toString(),
        interval: 'Registered accounts',
        trend: getTrendFromRecent(dashboardData.users.total, dashboardData.users.total - dashboardData.recent.users.total),
      },
    ];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%' } }}>
      <Typography fontFamily="'Jersey 15', sans-serif" component="h2" variant="h4" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mb: (theme) => theme.spacing(3) }}>
          {/* Stat Cards */}
          {getStatCards().map((card, index) => (
            <Grid item xs={12} sm={6} xl={4} key={index}>
              <StatCard {...card} />
            </Grid>
          ))}
          
          {/* Charts Section */}
          <Grid item xs={12} md={8}>
            <SessionsChart data={dashboardData.recent.dailyStats} />
          </Grid>
          
          {/* Right Column - Alerts */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Product Alert */}
              <ProductAlert productData={dashboardData.products} />
              
         
            </Stack>
          </Grid>
          
          {/* User Chart */}
          <Grid item xs={12} md={6}>
            <ChartUserByCountry userData={dashboardData.users} />
          </Grid>
          
          {/* Order Status Chart */}
          <Grid item xs={12} md={6}>
            <OrderStatusChart orderData={dashboardData.orders} />
          </Grid>
        </Grid>
      )}
  
      <Copyright sx={{ my: 5 }} />
    </Box>
  );
}
