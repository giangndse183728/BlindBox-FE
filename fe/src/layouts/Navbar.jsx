import * as React from 'react';
import { NavLink } from 'react-router-dom';
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
import ButtonCus from '../components/Button/ButtonCus';

export default function ButtonAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [showNavbar, setShowNavbar] = React.useState(false);
  const [scale, setScale] = React.useState(1); 

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newScale = Math.min(1 + scrollTop / 1000, 1.5); // Scale video between 1 and 2
      setScale(newScale);
      if (window.scrollY > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    
            <>


    <Box >
      
      {/* Conditionally render the navbar based on scroll */}
      <AppBar
        sx={{
          bgcolor: 'rgba(10, 10, 10, 0.6)',
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
          opacity: showNavbar ?  1 : 0,
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            fontFamily="'Jersey 15', sans-serif" 
            variant="h3" 
            component="div" 
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}
          >
             BlindB!ox 
          </Typography>
          <NavLink to="/Login" className="nav-link">
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

      {/* Drawer component for the off-canvas menu */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ 
          '& .MuiDrawer-paper': {
            marginTop: '90px',
            marginLeft:'20px',
            height:600,
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
          <Typography fontFamily="'Jersey 15', sans-serif"  color='white' variant="h4" component="div" sx={{ mt: 1, textAlign: 'center' }}>
              BlindB!ox  
          </Typography>
          <Divider sx={{ m: 1, borderColor: 'rgba(255, 255, 255, 0.3)'}} />
          <List>
            {['Home', 'Collection', 'Trading', 'Custom Accessories', 'Inventory', 'Profile', 'Sales', 'Orders'].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton >
                  <ListItemText  primary={text} sx={{ color: 'white' }}  />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ m: 1 }} />
            <NavLink to="/Login" className="nav-link">
            <ListItemButton> <ListItemText primary="Login" /> </ListItemButton>
            </NavLink>
          </List>
        </Box>
      </Drawer>
    </Box>
    </>
  );
}
