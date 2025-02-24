import { useEffect, useState } from "react";
import { Box } from '@mui/material';
import Footer from '../../layouts/Footer';
import { fetchUserData } from "../../api/profileApi"; 

const ProfilePage = () => {
    const [user, setUser] = useState({
        _id: '67aca5e59ebdb4fb6e4065ea',
        userName: 'phuoctest',
        password: '8ae58d58b4a6fd211cda8cd3d7e82a1f66519c209f6f6f205c73b94249e5ed78',
        email: 'phuoc00@gmail.com',
        phoneNumber: '0901308975',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const userData = await fetchUserData();
                setUser(userData);
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "10px" }}>Loading...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>;

    return (
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            <div style={{ flex: '1 0 auto', display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", marginTop: "80px" }}>
                {/* Profile Header Section */}
                <div style={{ width: "80%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <img src="/profile-avatar.png" alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #FFD700" }} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>{user?.userName}</h2>
                            <p style={{ margin: 0, color: "gray" }}>{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Details Section */}
                <div style={{ width: "80%", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                    {/* Sidebar */}
                    <div style={{ width: "20%", backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                        <p style={{ fontWeight: "bold" }}>Navigation</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li style={{ padding: "10px 0", cursor: "pointer" }}>🏠 Home</li>
                            <li style={{ padding: "10px 0", cursor: "pointer" }}>👥 My Network</li>
                            <li style={{ padding: "10px 0", cursor: "pointer" }}>🔔 Notifications</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div style={{ width: "75%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", }}>
                        <h3>About Me</h3>
                        <p style={{ color: "gray" }}>This is the biography section where the user can add personal details.</p>
                        <h3>Profile Details</h3>
                        <p><strong>ID:</strong> {user?._id}</p>
                        <p><strong>Username:</strong> {user?.userName}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Phone Number:</strong> {user?.phoneNumber}</p>
                        <p><strong>Address:</strong> {user?.address}</p>
                    </div>
                </div>
            </div>
            <Footer style={{ flexShrink: 0 }} />
        </div>
    );
};

export default ProfilePage;
