import api from './baseURL';

const accNumber = process.env.REACT_APP_ACC;
const bankName = process.env.REACT_APP_BANK_NAME;


export const login = async (email, password) => {
    try {
        const response = await api.post('/accounts/login', {
            email,
            password
        });

        const accessToken = response.data.result.accessToken;
        localStorage.setItem('token', accessToken);

        return true;

    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Failed to log in');
    }
};

export const signup = async (userData) => {
    try {
        await api.post('/accounts/register', userData);
        return true;
    } catch (error) {
        throw error.response || new Error('Failed to sign up');
    }
};

export const fetchUserData = async () => {
    try {
        const userResponse = await api.get('/accounts/me');
        const userData = userResponse.data.result;

        localStorage.setItem("user", JSON.stringify({ name: userData.userName, email: userData.email, role: userData.role, isSeller: userData.isRegisterSelling }));

        return userData;

    } catch (error) {
        throw new Error('Failed to fetch user data');
    }
};

export const logout = async () => {
    try {
        await api.post('/accounts/logout', {}, { withCredentials: true });
        // Clear all stored data
        localStorage.clear();
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
        throw new Error('Failed to logout');
    }
};

export const fetchProfile = async () => {
    try {
        const userResponse = await api.get('/accounts/me');
        const userData = userResponse.data.result;

        return userData;

    } catch (error) {
        throw new Error('Failed to fetch user data');
    }


};

// Update user data
export const updateUserData = async (updatedUser) => {
    try {
        console.log(updatedUser);
        const response = await api.patch('/accounts/me', updatedUser);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user data');
    }
};

export const updateSellerStatus = async () => {
    try {
        const response = await api.patch('/accounts/register-seller');
        return response.data;
    } catch (error) {
        throw new Error('Failed to update seller status');
    }
};

export const addCredit = async (amount = 10000) => {
    try {
        const response = await api.post("/payment/topup");

        const { content, conversionRate } = response.data.result;

        const qrUrl = `https://qr.sepay.vn/img?acc=${accNumber}&bank=${bankName}&amount=${amount}&des=${encodeURIComponent(content)}&lock=true`;


        return {
            apiResponse: response.data.result,
            qrUrl: qrUrl,
            conversionRate: conversionRate,
            amount: amount
        };
    } catch (error) {
        console.error("Error generating topup instructions:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Failed to generate topup instructions");
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post('/accounts/forgot-password', {
            email: email
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to send reset link');
    }
};

export const resetPassword = async (password, confirm_password, forgot_password_token) => {
    try {
        const response = await api.post('/accounts/reset-password', {
            password,
            confirm_password,
            forgot_password_token
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
};

