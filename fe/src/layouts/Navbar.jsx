import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../pages/Shoppingcart/CartContext";
import {
  AppBar,
  Box,
  Toolbar,
  Avatar,
  Popover,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ButtonCus from "../components/Button/ButtonCus";
import {
  HomeOutlined as HomeOutlinedIcon,
  Home as HomeIcon,
  CollectionsOutlined as CollectionsOutlinedIcon,
  Collections as CollectionsIcon,
  ChangeCircleOutlined as ChangeCircleOutlinedIcon,
  ChangeCircle as ChangeCircleIcon,
  BackpackOutlined as BackpackOutlinedIcon,
  Backpack as BackpackIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  DesignServicesOutlined as DesignServicesOutlinedIcon,
  DesignServices as DesignServicesIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
  MonetizationOn as MonetizationOnIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const { cart } = useCart() || { cart: [] };
  const cartCount = cart.length || 0;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const nameUser = storedUser.name || "Guest";
  const email = storedUser.email || "";
  const image = storedUser.image || "";  
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    
  }, []);


  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set anchorEl correctly
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    // Clear all localStorage
    setIsAuthenticated(false);
    handleClose() ;
    localStorage.clear();
    navigate('/');
  };
  
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
        <AppBar sx={{ bgcolor: 'rgba(10, 10, 10, 0.6)', transition: 'opacity 0.5s ease-in-out', opacity: showNavbar ? 1 : 0, position: 'fixed', top: 0, width: '90%', left: '50%', transform: 'translateX(-50%)', borderRadius: '10px', marginTop: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component={NavLink} to="/"
              fontFamily="'Jersey 15', sans-serif"
              variant="h3"
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}>
              BlindB!ox
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NavLink to="/cart" className="nav-link">
                <Badge
                  badgeContent={cartCount}
                  sx={{
                    '& .MuiBadge-dot': {
                      backgroundColor: 'yellow',
                    },
                    '& .MuiBadge-colorSecondary': {
                      backgroundColor: 'yellow',
                      color: 'black',
                      fontWeight:"bold"
                    },
                  }}
                  color="secondary"
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 22, color: 'white' }} />
                </Badge>
              </NavLink>
              {isAuthenticated ? (
              <IconButton onClick={handleOpen}>
                <Avatar src={image} alt={nameUser}>{nameUser.charAt(0)}</Avatar>
              </IconButton>
            ) : (
              <NavLink to="/Login">
                <ButtonCus variant="button-1" width="60px">Login</ButtonCus>
              </NavLink>
            )}
            </Box>
          </Toolbar>
        </AppBar>

        <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: "black", // Black background
            color: "white", // White text
            fontFamily: "'Jersey 15', sans-serif", // Apply custom font
            borderRadius: 2, // Rounded corners
            boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.3)", // Soft glow effect
            minWidth: 200, // Adjust width
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
        <Typography variant="subtitle2" noWrap sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
         Welcome 👾
    </Typography>
    <Typography variant="body2" noWrap sx={{ color: "gray", fontFamily: "'Jersey 15', sans-serif" }}>
    {nameUser}
    </Typography>
        </Box>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} /> 
        <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontFamily: "'Jersey 15', sans-serif" }}>Logout</MenuItem>
      </Popover>


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
              {isAuthenticated ? (
              <IconButton onClick={handleOpen}>
                <Avatar src={image} alt={nameUser}>{nameUser.charAt(0)}</Avatar>
              </IconButton>
            ) : (
              <NavLink to="/Login">
                <ButtonCus variant="button-1" width="60px">Login</ButtonCus>
              </NavLink>
            )}
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