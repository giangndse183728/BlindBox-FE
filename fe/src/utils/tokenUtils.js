/**
 * Decodes a JWT token and returns the payload
 * @param {string} token - The JWT token to decode
 * @return {Object|null} The decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) {
      // Get from localStorage if no token provided
      token = localStorage.getItem('token');
      if (!token) return null;
    }
    
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64Url decode the payload (second part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 