import  api  from './baseURL';

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
        const response = await api.post('/accounts/register', {
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            phoneNumber: userData.phoneNumber
        });

        return true;

    } catch (error) {
        console.error('Error signing up:', error);
        if (error.response) {
            throw error;
        } else {
            throw new Error('Failed to sign up');
        }
    }
};

export const fetchUserData = async () => {
    try {
        const userResponse = await api.get('/accounts/me');
        const userData = userResponse.data.result;
        
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify({ name: userData.userName, email: userData.email }));
        
        return userData;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }
};


