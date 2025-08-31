import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthDebugger = () => {
  const [authData, setAuthData] = useState({
    userId: null,
    userIdType: null,
    userRole: null,
    isLoggedIn: false,
    token: null
  });

  useEffect(() => {
    const userId = AuthService.getUserId();
    const userRole = AuthService.getUserRole();
    const isLoggedIn = AuthService.isLoggedIn();
    const token = AuthService.getToken();

    setAuthData({
      userId,
      userIdType: typeof userId,
      userRole,
      isLoggedIn,
      token: token ? token.substring(0, 20) + '...' : null
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2">Auth Debugger</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-semibold">User ID:</div>
        <div>{authData.userId || 'Not set'}</div>
        
        <div className="font-semibold">User ID Type:</div>
        <div>{authData.userIdType}</div>
        
        <div className="font-semibold">User Role:</div>
        <div>{authData.userRole || 'Not set'}</div>
        
        <div className="font-semibold">Is Logged In:</div>
        <div>{authData.isLoggedIn ? 'Yes' : 'No'}</div>
        
        <div className="font-semibold">Token:</div>
        <div>{authData.token || 'Not set'}</div>
      </div>
    </div>
  );
};

export default AuthDebugger;
