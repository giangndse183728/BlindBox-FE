import { useEffect, useState } from "react";
import { Box, TextField, Button } from '@mui/material';
import Footer from '../../layouts/Footer';
import { fetchUserData } from "../../api/profileApi";
import { useNavigate } from 'react-router-dom';
import GlassCard from "../../components/Decor/GlassCard";


const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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

    if (loading) return <p style={{ textAlign: "center", marginTop: "10px" }}>Loading...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Add API call to save the updated user data
        setIsEditing(false);
    };

    return (

        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', marginTop: '80px' }}>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <img src="/assets/gif/kirby-star.gif" alt="Pacman" style={{ width: '150px', height: 'auto' }} />
            </div>
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
            <div style={{ flex: '1 0 auto', display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", marginTop: "5px" }}>
                {/* Profile Header */}
                <GlassCard style={{ width: "80%", padding: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <img src="/assets/bill-cypher/pfp.jpeg" alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #FFD700" }} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: "white" }}>{user?.userName}</h2>
                            <p style={{ margin: 0, color: "gray" }}>{user?.email}</p>
                        </div>
                    </div>
                </GlassCard>

                {/* Profile Details Section */}
                <div style={{ width: "80%", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                    {/* Sidebar */}
                    <GlassCard style={{ width: "20%", padding: "15px", marginLeft: "-20px" }}>
                        <h3 style={{ color: "white" }}>About Me</h3>
                        <TextField
                            id="outlined-basic"
                            label="Biography"
                            variant="outlined"
                            value={user?.aboutMe}
                            placeholder="This is the biography section where the user can add personal details."
                            fullWidth
                            margin="normal"
                            multiline
                            rows={8.5}
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </GlassCard>

                    {/* Main Content */}
                    <GlassCard style={{ width: "75%", padding: "20px", marginRight: "-20px" }}>
                        <h3 style={{ color: "white" }}>Profile Details</h3>
                        <TextField
                            id="outlined-basic"
                            label="ID"
                            variant="outlined"
                            value={user?._id}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                width: '48%',
                                marginRight: '4%',
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            value={user?.userName}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                width: '48%',
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            value={user?.email}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                width: '48%',
                                marginRight: '4%',
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Phone Number"
                            variant="outlined"
                            value={user?.phoneNumber}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                width: '48%',
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Address"
                            variant="outlined"
                            value={user?.address}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: !isEditing, style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                width: '48%',
                                marginRight: '4%',
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button variant="outlined" onClick={handleEdit} style={{ marginRight: '10px', color: '#FFD700', borderColor: '#FFD700' }}>Edit</Button>
                            <Button variant="contained" onClick={handleSave} style={{ backgroundColor: '#FFD700', color: 'black' }}>Save</Button>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <Footer style={{ flexShrink: 0 }} />
        </div>
    );
};

export default ProfilePage;
