

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const AuthPopups = ({ isOpen, setIsAuthPopupsOpen, popupType, setPopupType }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    try {
      // Use AuthService to login
      const { role } = await AuthService.login(username, password);
      
      // Close the login popup
      setIsAuthPopupsOpen(false);
      
      // Navigate based on user role
      switch(role) {
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor-dashboard');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist-dashboard');
          break;
        case 'PATIENT':
          navigate('/patient-profile');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const username = e.target.username?.value?.trim();
    const email = e.target.email?.value?.trim();
    const password = e.target.password?.value;

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Always register as PATIENT per requirement
      const { role } = await AuthService.register(username, email, password);

      // Close the popup
      setIsAuthPopupsOpen(false);

      // Navigate based on role (should be PATIENT)
      if (role === 'PATIENT') {
        navigate('/patient-profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthPopupsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {popupType === 'signup' ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <form onSubmit={handleRegister}>
              {/* Signup Form */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Full Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Password"
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{' '}
              <span
                onClick={() => setPopupType('login')}
                className="text-customBlue2 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              {/* Login Form */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
                  placeholder="Username"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
                  placeholder="Password"
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : 'Login'}
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              Don't have an account?{' '}
              <span
                onClick={() => setPopupType('signup')}
                className="text-customBlue2 hover:underline cursor-pointer"
              >
                Create one here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPopups;
