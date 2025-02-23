import { useEffect, useState } from "react";
import { fetchUserData } from "../api/profileApi";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "10px" }}>Profile</h2>
            <div style={{ marginBottom: "10px" }}>
                <p><strong>Username:</strong> {user?.userName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>
            <button style={{ width: "100%", backgroundColor: "blue", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none" }}
                onMouseOver={(e) => e.target.style.backgroundColor = "darkblue"}
                onMouseOut={(e) => e.target.style.backgroundColor = "blue"}>
                Edit Profile
            </button>
        </div>
    );
};

export default ProfilePage;
