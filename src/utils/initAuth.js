import axios from 'axios';
import AuthService from '../services/AuthService';

/**
 * Initialize authentication state
 * This function is called when the app starts
 * It sets up the axios authorization header if a token exists and is not expired
 */
const initAuth = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Check if token is expired
    if (AuthService.isTokenExpired()) {
      // Token is expired, log the user out
      console.log('Token expired, logging out');
      AuthService.logout();
      return;
    }
    
    // Set default authorization header for all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default initAuth;
