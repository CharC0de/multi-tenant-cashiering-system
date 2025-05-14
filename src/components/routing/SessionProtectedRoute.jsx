
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { axiosInstance } from '../../config/globals';
import Cookies from 'js-cookie';
export default function SessionProtectedRoute() {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        axiosInstance.get('/api/auth-check/')
            .then(res => setAuth(res.data.isAuthenticated))
            .catch(() => { setAuth(false); }) // remove session cookie on error;
    }, []);
    if (auth === null) return (<div>Loading...</div>);

    return auth
        ? <Outlet />
        : <Navigate to="/login" replace />;
}
