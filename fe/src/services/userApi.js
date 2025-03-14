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
      await api.post('/accounts/register', userData);
      return true;
    } catch (error) {
      console.error('Error signing up:', error.response?.data || error.message);
      throw error.response || new Error('Failed to sign up');
    }
  };

export const fetchUserData = async () => {
    try {
        const userResponse = await api.get('/accounts/me');
        const userData = userResponse.data.result;
        
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify({ name: userData.userName, email: userData.email, role: userData.role, isSeller: userData.isRegisterSelling }));
        
        return userData;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
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
        console.error('Error fetching user data:', error);
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
        console.error('Error updating user data:', error);
        throw new Error('Failed to update user data');
    }
};

export const updateSellerStatus = async () => {
    try {
        const response = await api.patch('/accounts/register-seller');
        return response.data;
    } catch (error) {
        console.error('Error updating seller status:', error);
        throw new Error('Failed to update seller status');
    }
};


