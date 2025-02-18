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
  { text: 'Collection', path: '/collection', icon: CollectionsOutlinedIcon, activeIcon: CollectionsIcon },
  { text: 'Trading', path: '/trading', icon: ChangeCircleOutlinedIcon, activeIcon: ChangeCircleIcon },
  { text: 'Custom Accessories', path: '/custom-accessories', icon: DesignServicesOutlinedIcon, activeIcon: DesignServicesIcon },
  { text: 'Inventory', path: '/inventory', icon: BackpackOutlinedIcon, activeIcon: BackpackIcon },
  { text: 'Profile', path: '/profile', icon: AccountCircleOutlinedIcon, activeIcon: AccountCircleIcon },
  { text: 'Sales', path: '/sales', icon: MonetizationOnOutlinedIcon, activeIcon: MonetizationOnIcon },
  { text: 'Orders', path: '/orders', icon: ReceiptOutlinedIcon, activeIcon: ReceiptIcon },
];

export default function ButtonAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const location = useLocation();
  const [hovered, setHovered] = React.useState(null);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <>
      <Box>
        <AppBar sx={{ bgcolor: 'rgba(10, 10, 10, 0.6)', transition: '0.5s', position: 'fixed', top: 0, width: '90%', left: '50%', transform: 'translateX(-50%)', borderRadius: '10px', marginTop: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography fontFamily="'Jersey 15', sans-serif" variant="h3" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>BlindB!ox</Typography>
            <NavLink to="/Login" className="nav-link" style={{ textDecoration: 'none' }}>
              <ButtonCus variant="button-1" width="60px"> Login </ButtonCus>
            </NavLink>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)} sx={{ '& .MuiDrawer-paper': { marginTop: '90px', marginLeft: '20px', height: 600, borderRadius: 10, bgcolor: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', } }}>
          <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <Typography fontFamily="'Jersey 15', sans-serif" color='white' variant="h4" sx={{ mt: 1, textAlign: 'center' }}>BlindB!ox</Typography>
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
