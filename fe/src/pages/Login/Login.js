import React, { useState, useEffect,  lazy, Suspense } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Grid, ToggleButton, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import GoogleSignInButton from '../../components/Button/GoogleButton';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Copyright from '../../components/Text/Copyright';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import ThreeScene from './ThreeScene';

const tabItems = [
    {
        key: 'login',
        label: 'Login',
        fields: [
            {
                name: 'email',
                label: 'Email',
                type: 'text',
                autoComplete: 'email',
                required: true,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                autoComplete: 'current-password',
                required: true,
            }
        ],
        extraContent: (
            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <FormControlLabel
                        control={<Checkbox value="remember" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-checked': { color: 'white' }
                        }} />}
                        label={<Typography sx={{ color: 'white' }}>Remember me</Typography>}
                    />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="flex-end">
                    <Link href="#" variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        '&:hover': { color: 'white' } 
                    }}>
                        Forgot password?
                    </Link>
                </Grid>
            </Grid>
        ),
        showGoogleButton: true
    },
    {
        key: 'sign',
        label: 'Sign Up',
        fields: [
            {
                name: 'username',
                label: 'Username',
                type: 'text',
                autoComplete: 'new-username',
                required: true,
            },
            {
                name: 'email',
                label: 'Email',
                type: 'text',
                autoComplete: 'email',
                required: true,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                autoComplete: 'new-password',
                required: true,
            },
            {
                name: 'confirm-password',
                label: 'Confirm Password',
                type: 'password',
                autoComplete: 'new-password',
                required: true,
            },
            {
                name: 'phone',
                label: 'Phone',
                type: 'tel',
                autoComplete: 'tel',
                required: true,
            }
        ],
        showGoogleButton: false
    }
];

export default function Login() {
    const [selectedTab, setSelectedTab] = useState('login');
    const [isLoading, setIsLoading] = useState(true);
    const [tabAnimationKey, setTabAnimationKey] = useState(0);

    const currentTab = tabItems.find(tab => tab.key === selectedTab);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true
        });
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    const handleTabChange = (tabKey) => {
        setSelectedTab(tabKey);
        setTabAnimationKey(prevKey => prevKey + 1); // Trigger re-animation
    };

    const renderFields = (fields) => {
        return fields.map((field, index) => (
            <TextField
                key={field.name}
                margin="normal"
                required={field.required}
                fullWidth
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                autoFocus={index === 0}
                sx={{
                    input: { color: 'white' },
                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& label.Mui-focused': { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                    }
                }}
            />
        ));
    };

    return (
        <Grid container data-aos="fade" data-aos-delay="200" sx={{
            minHeight: '100vh',
            height: '100%',
            position: 'relative',
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 0.3s ease-in-out',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0
            
        }}>
            <CssBaseline />
    
         
        
        <ThreeScene />
  



            {/* Login Form */}


            <Grid
                item
                xs={12}
                sm={7}
                md={6}
                lg={5}
                component={Paper}
                elevation={12}
                square
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    ml: { md: 15, sm: 0 },
                    mt: { md: 5, sm: 0 },
                    mb: { md: 4, sm: 0 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    px: 6,
                    border: '1px solid rgba(128, 115, 1, 0.2)',
                    boxShadow: `
                        0 0 10px rgba(128, 115, 1, 0.1),
                        0 0 20px rgba(128, 115, 1, 0.05),
                        inset 0 0 20px rgba(128, 115, 1, 0.05)
                    `,
                    '@keyframes borderGlow': {
                        '0%': {
                            boxShadow: `
                                0 0 10px rgba(133, 98, 1, 0.1),
                                0 0 20px rgba(133, 98, 1, 0.05),
                                inset 0 0 20px rgba(133, 98, 1, 0.05)
                            `
                        },
                        '50%': {
                            boxShadow: `
                                0 0 15px rgba(189, 139, 2, 0.2),
                                0 0 30px rgba(189, 139, 2, 0.1),
                                inset 0 0 30px rgba(189, 139, 2, 0.1)
                            `
                        },
                        '100%': {
                            boxShadow: `
                                0 0 10px rgba(232, 213, 2, 0.1),
                                0 0 20px rgba(232, 213, 2, 0.05),
                                inset 0 0 20px rgba(232, 213, 2, 0.05)
                            `
                        }
                    },
                    animation: 'borderGlow 3s ease-in-out infinite',
                }}
            >
                <Box
                    data-aos="fade-up"
                    data-aos-delay="200"
                    sx={{

                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src="/assets/logoBB.png"
                        width="80"
                        height="80"
                        alt="."
                        data-aos="zoom-in"
                        data-aos-delay="400"
                    >

                    </img>
                    <Typography 
                        fontFamily="Yusei Magic" 
                        component="h1" 
                        variant="h5" 
                        sx={{ mt: 1, mb: 2, color: 'white' }}
                        data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        BlindB!ox
                    </Typography>

                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        {tabItems.map((tab, index) => (
                            <React.Fragment key={tab.key}>
                                <ToggleButton
                                    color="warning"
                                    sx={{ 
                                        border: "none", 
                                        width: 200,
                                        color: 'white',
                                        '&.Mui-selected': {
                                            color: '#fcba03',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    value={tab.key}
                                    selected={selectedTab === tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    {tab.label}
                                </ToggleButton>
                                {index < tabItems.length - 1 && (
                                    <Divider sx={{ m: 1 }} orientation="vertical" variant="middle" flexItem />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Box      
                        component="form"
                        noValidate
                        data-aos="fade-up"
                        data-aos-delay="200"
                        key={tabAnimationKey}
                        >

                        {renderFields(currentTab.fields)}
                        
                        {currentTab.extraContent}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<img src="/images/iconcross.png" alt="" style={{ width: '25px', marginRight: '1px' }} />}
                            sx={{
                                mt: 3,
                                mb: 1,
                                backgroundColor: '#d9a002',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#fcba03',
                                },
                            }}
                        >
                            {selectedTab === 'login' ? 'Sign In' : 'Sign Up'}
                        </Button>

                        {currentTab.showGoogleButton && <GoogleSignInButton />}

                        <Box mt={1} mb={2}>
                            <Copyright />
                        </Box>
                    </Box>
                </Box>
            </Grid>




        </Grid>
    );
}
