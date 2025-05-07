import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Avatar, FormHelperText } from '@mui/material';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../config/globals';
import { useNavigate } from 'react-router-dom';
export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatarFile: null,
        avatarPreview: null,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();

    // Validate passwords whenever they change
    useEffect(() => {
        setPasswordsMatch(form.password === form.confirmPassword);
    }, [form.password, form.confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                avatarFile: file,
                avatarPreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            return; // prevent submit when passwords don't match
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('password', form.password);
        if (form.avatarFile) formData.append('avatar', form.avatarFile);

        try {
            await axiosInstance.post('/api/register/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Registered successfully!');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (e) {
            console.error(e);
            alert('Registration failed');
        }
    };

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
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>

                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar src={form.avatarPreview} sx={{ width: 80, height: 80 }} />
                </Box>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                        Choose Avatar
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        fullWidth
                        margin="normal"
                        required
                        onChange={handleChange}
                    />

                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        onChange={handleChange}
                    />

                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        onChange={handleChange}
                    />

                    <TextField
                        id="confirm-password"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        error={!passwordsMatch}
                        onChange={handleChange}
                    />
                    {!passwordsMatch && (
                        <FormHelperText error>
                            Passwords do not match
                        </FormHelperText>
                    )}

                    <Button
                        id="register-button"
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={!passwordsMatch}
                    >
                        Register
                    </Button>

                    <Box textAlign="center" mt={1}>
                        <Link to="/login">Already have an account? Login</Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
