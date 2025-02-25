import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import CollectionsIcon from '@mui/icons-material/Collections';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import BackpackOutlinedIcon from '@mui/icons-material/BackpackOutlined';
import BackpackIcon from '@mui/icons-material/Backpack';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ButtonCus from '../components/Button/ButtonCus';

const menuItems = [
  { text: 'Home', path: '/', icon: HomeOutlinedIcon, activeIcon: HomeIcon },
  { text: 'Collection', path: '/Collection-page', icon: CollectionsOutlinedIcon, activeIcon: CollectionsIcon },
  { text: 'Trading', path: '/trading', icon: ChangeCircleOutlinedIcon, activeIcon: ChangeCircleIcon },
  { text: 'Custom Accessories', path: '/custom-accessories', icon: DesignServicesOutlinedIcon, activeIcon: DesignServicesIcon },
  { text: 'Inventory', path: '/inventory', icon: BackpackOutlinedIcon, activeIcon: BackpackIcon },
  { text: 'Profile', path: '/profile', icon: AccountCircleOutlinedIcon, activeIcon: AccountCircleIcon },
  { text: 'Sales', path: '/sales', icon: MonetizationOnOutlinedIcon, activeIcon: MonetizationOnIcon },
  { text: 'Orders', path: '/orders', icon: ReceiptOutlinedIcon, activeIcon: ReceiptIcon },
];

export default function ButtonAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [showNavbar, setShowNavbar] = React.useState(false);
  const location = useLocation();
  const [hovered, setHovered] = React.useState(null);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (location.pathname === '/') {
        if (scrollTop > 50) {
          setShowNavbar(true);
        } else {
          setShowNavbar(false);
        }
      }
    };

    if (location.pathname !== '/') {
      setShowNavbar(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <>
      <Box>
        <AppBar
          sx={{
            bgcolor: 'rgba(10, 10, 10, 0.6)',
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            opacity: showNavbar ? 1 : 0,
            position: 'fixed',
            top: 0,
            width: '90%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '10px',
            marginTop: '10px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component={NavLink}
              to="/"
              fontFamily="'Jersey 15', sans-serif"
              variant="h3"
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              BlindB!ox
            </Typography>
            <NavLink to="/Login" className="nav-link" style={{ textDecoration: 'none' }}>
              <ButtonCus variant="button-1" width="60px"> Login </ButtonCus>
            </NavLink>
          </Toolbar>
        </AppBar>

        {!showNavbar && (
          <AppBar
            sx={{
              bgcolor: 'rgba(150, 1, 1, 0.0)',
              boxShadow: 'none',
              position: 'fixed',
              top: 0,
              width: '100%',
              transition: 'opacity 0.5s ease-in-out',
              opacity: showNavbar ? 0 : 1,
            }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="black"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography color="black" fontFamily="Yusei Magic" variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                BlindB!ox
              </Typography>
              <NavLink to="/Login" className="nav-link">
                <Button sx={{ color: 'black' }}>Login</Button>
              </NavLink>
            </Toolbar>
          </AppBar>
        )}

        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              marginTop: '90px',
              marginLeft: '20px',
              height: 600,
              borderRadius: 10,
              bgcolor: 'rgba(10, 10, 10, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <Box
            sx={{ width: 300 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography fontFamily="'Jersey 15', sans-serif" color='white' variant="h4" sx={{ mt: 1, textAlign: 'center' }}>
              BlindB!ox
            </Typography>
            <Divider sx={{ m: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
            <List>
              {menuItems.map(({ text, path, icon: Icon, activeIcon: ActiveIcon }) => (
                <NavLink to={path} key={text} style={{ textDecoration: 'none', color: 'white' }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onMouseEnter={() => setHovered(text)}
                      onMouseLeave={() => setHovered(null)}
                      sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                    >
                      {hovered === text || location.pathname === path ? <ActiveIcon /> : <Icon />}
                      <ListItemText primary={text} sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                </NavLink>
              ))}
            </List>
            <Divider sx={{ m: 1 }} />
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
