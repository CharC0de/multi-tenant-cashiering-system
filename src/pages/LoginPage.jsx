import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/globals';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();                                 // programmatic nav :contentReference[oaicite:4]{index=4}

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/login/', form);
            const res = await axiosInstance.post('/api/token/', form);
            localStorage.setItem('access_token', res.data.access);
            navigate('/home');
        } catch (err) {
            console.error(err.response || err);
            alert('Login failed');
        }
    };

    const { user } = useAuth()

    useEffect(() => { if (user) navigate("/home") }, [navigate, user])// import the user from the context
    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email" label="Email" type="email"
                        fullWidth margin="normal" required
                        onChange={handleChange}
                    />
                    <TextField
                        name="password" label="Password" type="password"
                        fullWidth margin="normal" required
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                    <Box textAlign="center" mt={1}>
                        <Link to="/register">Don't have an account? Register</Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
