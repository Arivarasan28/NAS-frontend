import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * Role-based route protection component
 * Redirects to login if user is not authenticated or doesn't have the required role
 */
const ProtectedRoutes = ({ allowedRole }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and has the correct role
        const isLoggedIn = AuthService.isLoggedIn();
        const userRole = AuthService.getUserRole();
        
        // If no token or role doesn't match, redirect to home page
        if (!isLoggedIn || userRole !== allowedRole) {
            navigate("/");
        }
    }, [allowedRole, navigate]);

    // If authenticated with correct role, render the child routes
    return <Outlet />;
};

export default ProtectedRoutes;
