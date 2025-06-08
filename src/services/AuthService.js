import axios from 'axios';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8081/api/auth';

/**
 * Service for handling authentication-related API calls
 */
class AuthService {
  /**
   * Login user and return user data with token
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise} - Promise with user data including token and role
   */
  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    if (response.data.token) {
      const token = response.data.token;
      
      // Store user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.userId);
      
      // Decode token to extract additional information
      try {
        const decodedToken = jwtDecode(token);
        
        // Store additional claims from token
        if (decodedToken.userId) {
          localStorage.setItem('userId', decodedToken.userId);
        }
        
        if (decodedToken.role) {
          localStorage.setItem('userRole', decodedToken.role);
        }
        
        // Store token expiration time
        if (decodedToken.exp) {
          localStorage.setItem('tokenExpiration', decodedToken.exp * 1000); // Convert to milliseconds
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      // Set default authorization header for all future requests
      this.setAuthHeader(token);
    }
    
    return response.data;
  }
  
  /**
   * Logout user by removing stored data
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
    delete axios.defaults.headers.common['Authorization'];
  }
  
  /**
   * Set authorization header for axios requests
   * @param {string} token - JWT token
   */
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
  
  /**
   * Check if user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  
  /**
   * Get current user role
   * @returns {string|null} - User role or null if not logged in
   */
  getUserRole() {
    return localStorage.getItem('userRole');
  }
  
  /**
   * Get current user ID
   * @returns {string|null} - User ID or null if not logged in
   */
  getUserId() {
    return localStorage.getItem('userId');
  }
  
  /**
   * Check if token is expired
   * @returns {boolean} - True if token is expired or expiration time is not available
   */
  isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true;
    
    return Date.now() > parseInt(expiration);
  }
  
  /**
   * Get JWT token
   * @returns {string|null} - JWT token or null if not logged in
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
