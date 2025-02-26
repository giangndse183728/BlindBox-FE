import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from '@mui/material';
import Footer from '../../layouts/Footer';
import { fetchUserData, updateUserData } from "../../api/profileApi";
import { useNavigate } from 'react-router-dom';
import GlassCard from "../../components/Decor/GlassCard";
import EditIcon from '@mui/icons-material/Edit';
import '@fontsource/jersey-15';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; // Reset on unmount
        };
    }, []);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const userData = await fetchUserData();
                if (!userData) {
                    setUser(null);
                } else {
                    setUser(userData);
                }
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (!loading && user === null) {
            navigate('/login', { replace: true });
        }
    }, [loading, user, navigate]);

    if (loading) return <p style={{ textAlign: "center", marginTop: "10px", fontFamily: 'Yusei Magic' }}>Loading...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "10px", fontFamily: 'Yusei Magic' }}>{error}</p>;

    const handleEdit = () => {
        setEditedUser(user);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (JSON.stringify(user) === JSON.stringify(editedUser)) {
                setIsEditing(false);
                return;
            }

            await updateUserData(editedUser);
            setUser(editedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value || '', // Ensures the field can be cleared
        }));
    };

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '80px',
            justifyContent: 'space-between',
            fontFamily: 'Yusei Magic',
        }}>
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
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '50px',
                flex: 1,
                minHeight: "calc(100vh - 80px)"
            }}>
                {/* Profile Header */}
                <GlassCard style={{ width: "80%", padding: "20px", marginBottom: "20px", position: 'relative' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "40px" }}>
                        <img src="/assets/bill-cypher/pfp.jpeg" alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #FFD700" }} />
                        <div>
                            <h2 style={{
                                margin: 0, color: "white", fontSize: "40px", fontFamily: '"Jersey 15", sans-serif'
                            }}>{user?.userName}</h2>
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
                                fontSize: '1.5rem',
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

                {/* Profile Details Section */}
                <div style={{ width: "80%", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                    {/* Sidebar */}
                    <GlassCard style={{ width: "20%", padding: "15px", marginLeft: "-20px", position: 'relative' }}>
                        <h3 style={{ color: "white" }}>About Me</h3>
                        <TextField
                            id="outlined-basic"
                            label="Biography"
                            variant="outlined"
                            value={user?.biography}
                            placeholder="This is the biography section where the user can add personal details."
                            fullWidth
                            margin="normal"
                            multiline
                            rows={8.5}
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                                style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' },
                            }}
                            InputLabelProps={{ style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Yusei Magic',
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Yusei Magic',
                                },
                            }}
                        />
                    </GlassCard>

                    {/* Main Content */}
                    <GlassCard style={{ width: "75%", padding: "20px", marginRight: "-20px" }}>
                        <h3 style={{ color: "white" }}>Profile Details</h3>

                        <TextField
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            name="userName"
                            value={isEditing ? editedUser?.userName || '' : user?.userName || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{ readOnly: !isEditing, style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' }, endAdornment: isEditing ? <EditIcon /> : null }}
                            InputLabelProps={{ style: { color: isEditing ? 'white' : 'gray' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isEditing ? 'white' : 'gray',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isEditing ? 'white' : 'gray',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isEditing ? 'white' : 'gray',
                                    },
                                },
                                width: '48%',
                                marginRight: '4%',

                                '& .MuiInputBase-input': {
                                    fontFamily: 'Yusei Magic',
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Yusei Magic',
                                },
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={isEditing ? editedUser?.email || '' : user?.email || ''}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true, style: { color: 'rgba(255, 255, 255, 0.5)' }, }}
                            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.5)' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                },
                                width: '48%',

                                '& .MuiInputBase-input': {
                                    fontFamily: 'Yusei Magic',
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Yusei Magic',
                                },
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Phone Number"
                            variant="outlined"
                            name="phoneNumber"
                            value={isEditing ? editedUser?.phoneNumber || '' : user?.phoneNumber || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{ readOnly: !isEditing, style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' }, endAdornment: isEditing ? <EditIcon /> : null }}
                            InputLabelProps={{ style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                },
                                width: '48%',
                                marginRight: '4%',

                                '& .MuiInputBase-input': {
                                    fontFamily: 'Yusei Magic',
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Yusei Magic',
                                },
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={isEditing ? editedUser?.address || '' : user?.address || ''}
                            placeholder="Enter your address"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{ readOnly: !isEditing, style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' }, endAdornment: isEditing ? <EditIcon /> : null }}
                            InputLabelProps={{ style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                },
                                width: '48%',


                                '& .MuiInputBase-input': {
                                    fontFamily: 'Yusei Magic',
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Yusei Magic',
                                },
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            {isEditing ? (
                                <Button variant="outlined" onClick={() => setIsEditing(false)} style={{ marginRight: '10px', color: '#FFD700', borderColor: '#FFD700' }}>
                                    Cancel
                                </Button>
                            ) : (
                                <Button variant="outlined" onClick={handleEdit} style={{ marginRight: '10px', color: '#FFD700', borderColor: '#FFD700' }}>
                                    Edit
                                </Button>
                            )}
                            {isEditing && (
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    style={{ backgroundColor: '#FFD700', color: 'black' }}
                                    disabled={JSON.stringify(user) === JSON.stringify(editedUser)}
                                >
                                    Save Changes
                                </Button>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
            <Footer style={{ flexShrink: 0, marginTop: 0, paddingTop: 0 }} />
        </div>
    );
};

export default ProfilePage;
