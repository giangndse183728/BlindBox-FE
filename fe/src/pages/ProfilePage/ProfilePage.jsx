import { useEffect, useState, Suspense } from "react";
import { Box, TextField, Button, Typography, Grid, Stack } from '@mui/material';
import Footer from '../../layouts/Footer';
import { useNavigate } from 'react-router-dom';
import GlassCard from "../../components/Decor/GlassCard";
import EditIcon from '@mui/icons-material/Edit';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import { fetchProfile, updateUserData, updateSellerStatus } from '../../services/userApi';
import { Formik } from 'formik';
import { profileSchema } from '../../utils/validationSchemas';
import { toast } from 'react-toastify';
import { useAddressManagement, AddressForm } from '../../components/Address/AddressComponents';
import SwitchCus from '../../components/Button/SwitchCus';

// Extracted reusable components
const FormTextField = ({ id, label, value, isEditing, handleChange, handleBlur, errors, touched, readOnly = false, multiline = false, rows = 1, placeholder = "" }) => {
    const isReadOnly = readOnly || !isEditing;

    return (
        <TextField
            id={id}
            name={id}
            label={label}
            variant="outlined"
            value={value || ''}
            placeholder={placeholder}
            fullWidth
            margin="normal"
            multiline={multiline}
            rows={rows}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[id] && Boolean(errors[id])}
            helperText={touched[id] && errors[id]}
            InputProps={{
                readOnly: isReadOnly,
                style: { color: isEditing && !readOnly ? 'white' : 'rgba(255, 255, 255, 0.5)' },
                endAdornment: isEditing && !readOnly ? <EditIcon /> : null
            }}
            InputLabelProps={{ style: { color: isEditing && !readOnly ? 'white' : 'rgba(255, 255, 255, 0.5)' } }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: isEditing && !readOnly ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    },
                    '&:hover fieldset': {
                        borderColor: isEditing && !readOnly ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: isEditing && !readOnly ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    },
                },
            }}
        />
    );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    const addressData = useAddressManagement(user?.address);
    const { generateFullAddress, parseAddress, setIsLoading: setAddressIsLoading } = addressData;

    // Fetch user data
    useEffect(() => {
        const getUser = async () => {
            setIsLoading(true);
            try {
                const userData = await fetchProfile();
                if (!userData) {
                    setUser(null);
                } else {
                    setUser(userData);
                    setIsSeller(userData.isRegisterSelling);
                    if (userData.address) {
                        await parseAddress(userData.address);
                    }
                }
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setIsLoading(false);
                setAddressIsLoading(false);
            }
        };

        getUser();
    }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && user === null) {
            navigate('/login', { replace: true });
        }
    }, [isLoading, user, navigate]);

    if (isLoading) return <LoadingScreen />;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "10px", fontFamily: 'Yusei Magic' }}>{error}</p>;

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const fullAddress = generateFullAddress();

            const changedFields = {};
            Object.keys(values).forEach(key => {
                if (key !== 'address' && values[key] !== user[key]) {
                    changedFields[key] = values[key];
                }
            });

            if (fullAddress !== user.address && fullAddress.trim() !== '') {
                changedFields.address = fullAddress;
            }

            if (Object.keys(changedFields).length === 0) {
                setIsEditing(false);
                setSubmitting(false);
                return;
            }

            await updateUserData(changedFields);

            setUser({ ...user, ...changedFields });
            setIsEditing(false);
            toast.success('Update profile successfully!');
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleSeller = async (checked) => {
        try {
            await updateSellerStatus();
            setIsSeller(checked);
            toast.success(`You are now ${checked ? 'registered as a seller' : 'no longer a seller'}.`);
        } catch (error) {
            console.error("Can not reverse");

        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '60px',
            justifyContent: 'space-between',
            fontFamily: 'Yusei Magic',
            overflowY: 'auto',
        }}>
            {isLoading && <LoadingScreen />}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(/assets/background.jpeg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                    zIndex: -2,
                }}
            />
            <Suspense fallback={<LoadingScreen />} />

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '50px',
                marginBottom: '50px',
                flex: 1,
            }}>
                {/* Profile Header */}
                <GlassCard style={{ width: "80%", padding: "20px", marginBottom: "20px", position: 'relative' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "40px" }}>
                        <img src="/assets/bill-cypher/pfp.jpeg" alt="Profile" style={{ width: "80px", height: "100%", borderRadius: "50%", border: "3px solid #FFD700" }} />
                        <div>
                            <p style={{
                                margin: 0, color: "white", fontSize: "45px", fontFamily: '"Jersey 15", sans-serif'
                            }}>{user?.userName}</p>
                            <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.5)", }}>{user?.email}</p>
                        </div>
                    </div>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Typography
                            color="white"
                            sx={{
                                ...yellowGlowAnimation,
                                textAlign: 'right',
                                position: 'relative',
                                top: '30px',
                                fontSize: '2rem',
                                fontFamily: '"Jersey 15", sans-serif !important',
                            }}
                        >
                            *****************
                        </Typography>
                        <img src="/assets/gif/kirby-star.gif" alt="Kirby" style={{ width: '150px', height: 'auto' }} />
                    </Box>
                </GlassCard>

                {/* Formik Form */}
                <Formik
                    initialValues={{
                        userName: user?.userName || '',
                        email: user?.email || '',
                        fullName: user?.fullName || '',
                        phoneNumber: user?.phoneNumber || '',
                        address: user?.address || '',
                        biography: user?.biography || '',
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit} style={{ width: "80%", display: "flex", justifyContent: "space-between", gap: "20px" }}>

                            {/* Sidebar */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: "20%", // Sidebar width
                                }}
                            >
                                {/* Register to be Seller Title - Pushing Sidebar Down */}
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: "white",
                                        fontFamily: '"Jersey 15", sans-serif',
                                        textAlign: "center",
                                        mb: 2,
                                    }}
                                >
                                   *Register <span style={{...yellowGlowAnimation}}>Seller</span> 
                                </Typography>
                            

                                {/* Sidebar (Policy Card) */}
                                <GlassCard
                                    style={{
                                        width: "100%",
                                        padding: "15px",
                                        minHeight: "200px",
                                        maxHeight: "480px",
                                        overflowY: "auto",
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "rgba(255, 255, 255, 0.5) transparent",
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: "white", mb: 1, textAlign: "center", fontFamily: 'Yusei Magic' }}>
                                      - Policy -
                                    </Typography>
                                    <Box sx={{  mb: 8 }}>
                                    <Typography variant="body2" sx={{ color: "white", mb: 2, textAlign: "center", fontFamily: 'Yusei Magic' }}>
                                        By toggling <b><span style={{color:'yellow'}}>Sale Blindbox </span></b>, users become sellers and must follow these rules:
                                    </Typography>

                                    {[
                                        { title: "Verified users only", content: "Approval required." },
                                        { title: "Accurate listings", content: "No fraud or misleading info." },
                                        { title: "Pricing & Fees", content: "Sellers set prices. Platform takes a fee." },
                                        { title: "Secure Payments", content: "Payouts after confirmation." },
                                        { title: "Order Fulfillment", content: "Late/canceled orders may be penalized." },
                                        { title: "Compliance", content: "No illegal items. Violations may lead to removal or bans." },
                                        { title: "Account Control", content: "Sellers can disable selling anytime." },
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ mb: 4 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <img
                                                    src="/assets/pixel-heart.png"
                                                    alt="indent"
                                                    style={{ width: "14px", height: "14px" }}
                                                />
                                                <Typography variant="body2" sx={{ color: "white", fontWeight: "bold" }}>
                                                    {item.title}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                                {item.content}
                                            </Typography>
                                        </Box>
                                    ))}
                                    </Box>
                                    <Box sx={{ mb: 5, gap: 2 , alignItems: 'center', display: 'flex', flexDirection:'row', justifyContent: 'center' }}>
                                    <Typography variant="h5" sx={{  color: "rgba(255, 255, 255, 0.8)", fontFamily: '"Jersey 15", sans-serif', ...yellowGlowAnimation }}>
                                                Become Seller
                                            </Typography>
                                        <SwitchCus
                                     
                                        checked={isSeller}
                                        onChange={handleToggleSeller}
                                        
                                    />
                                    </Box>
                                    <Typography variant="body1" sx={{  color: "rgba(255, 255, 255, 0.8)", fontFamily: '"Jersey 15", sans-serif'}}>
                                    *Please complete all required fields in your profile to become a seller.
                                            </Typography>
                                </GlassCard>
                            </Box>

                            {/* Main Content */}
                            <GlassCard theme="dark" style={{ width: "75%", padding: "20px", marginRight: "-20px" }}>
                                <h3 style={{ color: "white" }}>Profile Details</h3>

                                <Grid container spacing={2}>
                                    {/* Email and Username row */}
                                    <Grid item xs={12} sm={6}>
                                        <FormTextField
                                            id="email"
                                            label="Email"
                                            value={values.email}
                                            isEditing={isEditing}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            errors={errors}
                                            touched={touched}
                                            readOnly={true}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormTextField
                                            id="userName"
                                            label="Username"
                                            value={values.userName}
                                            isEditing={isEditing}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            errors={errors}
                                            touched={touched}
                                            readOnly={true}
                                        />
                                    </Grid>

                                    {/* Full Name and Phone Number row */}
                                    <Grid item xs={12} sm={6}>
                                        <FormTextField
                                            id="fullName"
                                            label="Full Name"
                                            value={values.fullName}
                                            isEditing={isEditing}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormTextField
                                            id="phoneNumber"
                                            label="Phone Number"
                                            value={values.phoneNumber}
                                            isEditing={isEditing}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </Grid>

                                    <AddressForm isEditing={isEditing} addressData={addressData} />
                                </Grid>

                             
                            

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    {isEditing ? (
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancel}
                                            style={{ marginRight: '10px', color: '#FFD700', borderColor: '#FFD700' }}
                                        >
                                            Cancel
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            onClick={handleEdit}
                                            style={{ marginRight: '10px', color: '#FFD700', borderColor: '#FFD700' }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {isEditing && (
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            style={{ backgroundColor: '#FFD700', color: 'black' }}
                                            disabled={isSubmitting || Object.keys(errors).length > 0}
                                        >
                                            Save Changes
                                        </Button>
                                    )}
                                </Box>
                            </GlassCard>
                        </form>
                    )}
                </Formik>
            </div>
            <Footer style={{ flexShrink: 0, paddingTop: 0 }} />
        </div>
    );
};

export default ProfilePage;