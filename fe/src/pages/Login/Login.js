import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login, signup, fetchUserData } from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';

const LazyThreeScene = lazy(() => import('./ThreeScene'));

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

const validationSchemas = {
  login: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Required'),
  }),
  sign: Yup.object({
    username: Yup.string()
      .min(1, 'Username must be at least 1 character')
      .max(50, 'Username must be at most 50 characters')
      .matches(
        /^[a-zA-Z0-9]+$/, 
        'Username can only contain letters and numbers '
      )
      .required('Required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
      )
      .required('Required'),
    'confirm-password': Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number is invalid')
      .min(10, 'Phone number length must be from 10 to 15')
      .max(15, 'Phone number length must be from 10 to 15')
      .required('Required'),
  }),
};

export default function Login() {
    const [selectedTab, setSelectedTab] = useState('login');
    const [tabAnimationKey, setTabAnimationKey] = useState(0);
    const navigate = useNavigate();

    const currentTab = tabItems.find(tab => tab.key === selectedTab);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true
        });

    }, []);
  
    const handleTabChange = (tabKey) => {
        setSelectedTab(tabKey);
        setTabAnimationKey(prevKey => prevKey + 1); // Trigger re-animation
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            if (selectedTab === 'login') {
                await login(values.email, values.password);
                const userData = await fetchUserData();
                if (userData.role === 0) {
                    navigate('/Dashboard');
                } else {
                    navigate('/');
                }
            } else {
                // Handle signup
                const userData = {
                    userName: values.username,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values['confirm-password'],
                    phoneNumber: values.phone
                };
                try {
                    await signup(userData);
                    await fetchUserData();
                    navigate('/');
                } catch (signupError) {
                    if (signupError.response?.data) {
                        const errorData = signupError.response.data;
                       
                        if (errorData.errors) {
                            if (errorData.errors.email) {
                                setFieldError('email', errorData.errors.email.msg); 
                            }
                            if (errorData.errors.userName) {
                                setFieldError('username', errorData.errors.userName.msg);
                            }
                        } else if (errorData.message) {
                            setFieldError('email', errorData.message); // use toastify here
                        }
                    } else {
                        setFieldError('email', signupError.message || 'Failed to sign up. Please try again.'); // use toastify here
                    }
                    return;
                }
            }
        } catch (error) {
          
            if (selectedTab === 'login') {
                setFieldError('password', 'Invalid email or password'); // use toastify here
            } else {
                setFieldError('email', 'Registration failed. Please try again.'); // use toastify here
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderFields = (fields, formikProps) => {
        if (selectedTab === 'sign') {
            return (
                <>
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                error={Boolean(formikProps.touched.email && formikProps.errors.email)}
                                helperText={formikProps.touched.email && formikProps.errors.email}
                                {...formikProps.getFieldProps('email')}
                                sx={{
                                    input: { color: 'white' },
                                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff3d00'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="new-username"
                                error={Boolean(formikProps.touched.username && formikProps.errors.username)}
                                helperText={formikProps.touched.username && formikProps.errors.username}
                                {...formikProps.getFieldProps('username')}
                                sx={{
                                    input: { color: 'white' },
                                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff3d00'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                error={Boolean(formikProps.touched.password && formikProps.errors.password)}
                                helperText={formikProps.touched.password && formikProps.errors.password}
                                {...formikProps.getFieldProps('password')}
                                sx={{
                                    input: { color: 'white' },
                                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff3d00'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="confirm-password"
                                label="Confirm Password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                error={Boolean(formikProps.touched['confirm-password'] && formikProps.errors['confirm-password'])}
                                helperText={formikProps.touched['confirm-password'] && formikProps.errors['confirm-password']}
                                {...formikProps.getFieldProps('confirm-password')}
                                sx={{
                                    input: { color: 'white' },
                                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff3d00'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        error={Boolean(formikProps.touched.phone && formikProps.errors.phone)}
                        helperText={formikProps.touched.phone && formikProps.errors.phone}
                        {...formikProps.getFieldProps('phone')}
                        sx={{
                            input: { color: 'white' },
                            '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                            '& label.Mui-focused': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiFormHelperText-root': {
                                color: '#ff3d00'
                            }
                        }}
                    />
                </>
            );
        }

        return fields.map((field) => (
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
                error={Boolean(formikProps.touched[field.name] && formikProps.errors[field.name])}
                helperText={formikProps.touched[field.name] && formikProps.errors[field.name]}
                {...formikProps.getFieldProps(field.name)}
                sx={{
                    input: { color: 'white' },
                    '& label': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& label.Mui-focused': { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiFormHelperText-root': {
                        color: '#ff3d00'
                    }
                }}
            />
        ));
    };

    const formSection = (
        <Formik
            initialValues={
                currentTab.fields.reduce((acc, field) => {
                    acc[field.name] = '';
                    return acc;
                }, {})
            }
            validationSchema={validationSchemas[selectedTab]}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form noValidate>
                    {renderFields(currentTab.fields, formik)}
                    {currentTab.extraContent}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={formik.isSubmitting}
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
                </Form>
            )}
        </Formik>
    );

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



            <Suspense fallback={<LoadingScreen />}>
                    <LazyThreeScene />
                </Suspense>

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
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
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

                    {formSection}
                </Box>
            </Grid>




        </Grid>
    );
}
