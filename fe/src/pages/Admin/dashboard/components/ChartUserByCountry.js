import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// Replace country flags with suitable icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BlockIcon from '@mui/icons-material/Block';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Avatar from '@mui/material/Avatar';

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

const colors = [
  'hsl(144, 70%, 50%)', // Green for verified users
  'hsl(220, 25%, 65%)', // Blue-gray for unverified users
  'hsl(0, 70%, 50%)',   // Red for banned users
  'hsl(220, 25%, 45%)', // Darker blue-gray for total users
];

export default function ChartUserByCountry({ userData }) {
  // Default data in case userData is not provided
  const defaultData = {
    total: 0,
    verified: 0,
    unverified: 0,
    banned: 0
  };

  // Use provided userData or default data
  const users = userData || defaultData;
  
  // Prepare data for the pie chart
  const pieData = [
    { label: 'Verified Users', value: users.verified },
    { label: 'Unverified Users', value: users.unverified },
    { label: 'Banned Users', value: users.banned || 0 },
  ].filter(item => item.value > 0); // Only show segments with values > 0

  // If there's no data or all values are 0, add a placeholder
  if (pieData.length === 0) {
    pieData.push({ label: 'No Data', value: 1 });
  }

  // Calculate percentages for the progress bars
  const total = users.total || 1; // Avoid division by zero
  const userCategories = [
    {
      name: 'Verified Users',
      value: Math.round((users.verified / total) * 100),
      icon: (
        <Avatar sx={{ bgcolor: 'success.main', width: 30, height: 30 }}>
          <VerifiedUserIcon fontSize="small" />
        </Avatar>
      ),
      color: 'hsl(144, 70%, 50%)',
    },
    {
      name: 'Unverified Users',
      value: Math.round((users.unverified / total) * 100),
      icon: (
        <Avatar sx={{ bgcolor: 'info.light', width: 30, height: 30 }}>
          <PersonOutlineIcon fontSize="small" />
        </Avatar>
      ),
      color: 'hsl(220, 25%, 45%)',
    },
    {
      name: 'Total Users',
      value: 100,
      icon: (
        <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
          <PeopleAltIcon fontSize="small" />
        </Avatar>
      ),
      color: 'hsl(220, 25%, 65%)',
    }
  ];

  // Add banned users if there are any
  if (users.banned && users.banned > 0) {
    userCategories.splice(2, 0, {
      name: 'Banned Users',
      value: Math.round((users.banned / total) * 100),
      icon: (
        <Avatar sx={{ bgcolor: 'error.main', width: 30, height: 30 }}>
          <BlockIcon fontSize="small" />
        </Avatar>
      ),
      color: 'hsl(0, 70%, 50%)',
    });
  }

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '7px', flexGrow: 1, padding: '20px' }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" sx={{ mb: 2 }}>
          Users Overview
        </Typography>
        
        <Grid container spacing={2}>
          {/* Left column - Pie Chart */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box>
              <PieChart
                colors={colors}
                margin={{
                  left: 40,
                  right: 40,
                  top: 40,
                  bottom: 40,
                }}
                series={[
                  {
                    data: pieData,
                    innerRadius: 75,
                    outerRadius: 100,
                    paddingAngle: 1,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={260}
                width={260}
                slotProps={{
                  legend: { hidden: true },
                }}
              >
                <PieCenterLabel 
                  primaryText={users.total.toString()} 
                  secondaryText="Total" 
                />
              </PieChart>
            </Box>
          </Grid>
          
          {/* Right column - Progress bars */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack spacing={2} sx={{ width: '100%' }}>
              {userCategories.map((category, index) => (
                <Stack
                  key={index}
                  direction="row"
                  sx={{ alignItems: 'center', gap: 2 }}
                >
                  {category.icon}
                  <Stack sx={{ gap: 1, flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {category.value}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      aria-label="Number of users by category"
                      value={category.value}
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: category.color,
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

ChartUserByCountry.propTypes = {
  userData: PropTypes.shape({
    total: PropTypes.number,
    verified: PropTypes.number,
    unverified: PropTypes.number,
    banned: PropTypes.number
  })
};