import axios from 'axios';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminProtectedRoutes = () => {
    const role = localStorage.getItem("userRole");
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== "admin") {
            navigate("/login");
        }
    }, [role, navigate]);

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;

    return <Outlet/>;
}

export default AdminProtectedRoutes;
