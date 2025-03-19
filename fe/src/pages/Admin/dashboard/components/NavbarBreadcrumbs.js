import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation, Link } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Map of route paths to display names
const routeNameMap = {
  'dashboard': 'Dashboard',
  'users': 'Manage Users',
  'posts': 'Manage Posts',
  'promotions': 'Manage Promotions',
  'settings': 'Settings',
  'about': 'About',
  'feedback': 'Feedback'
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  
  // Parse the current path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Generate breadcrumb items
  const breadcrumbItems = [];
  
  // Always add Dashboard as the first item
  breadcrumbItems.push(
    <Typography 
      key="dashboard" 
      component={Link} 
      to="/dashboard"
      variant="body1" 
      sx={{ 
        color: pathnames.length === 1 ? 'text.primary' : 'text.secondary',
        fontWeight: pathnames.length === 1 ? 600 : 400,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
    >
      Dashboard
    </Typography>
  );
  
  // Add additional breadcrumb items based on the path
  if (pathnames.length > 1) {
    const currentPath = pathnames[pathnames.length - 1];
    const displayName = routeNameMap[currentPath] || currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
    
    breadcrumbItems.push(
      <Typography 
        key={currentPath} 
        variant="body1" 
        sx={{ 
          color: 'text.primary', 
          fontWeight: 600 
        }}
      >
        {displayName}
      </Typography>
    );
  }

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbItems}
    </StyledBreadcrumbs>
  );
}
