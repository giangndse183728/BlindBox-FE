import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  // Get user data from localStorage
  const [userData, setUserData] = React.useState({
    name: 'User',
    email: 'user@example.com'
  });

  React.useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData({
          name: user.username || user.name || 'User',
          email: user.email || 'user@example.com'
        });
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);

  // Get first letter of name for Avatar
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
          alignItems:'center',
          ml: 2
        }}
      >
         <img
                        src="/assets/logoBB.png"
                        width="60"
                        height="60"
                        alt="."
                      
                    >
                    </img>
                    <Typography
                        fontFamily="Yusei Magic"
                        component="h1"
                        variant="h5"
                        sx={{  color: 'white'}}
                   
                    >
                        BlindB!ox
                    </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={userData.name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
        >
          {getInitials(userData.name)}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {userData.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {userData.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
