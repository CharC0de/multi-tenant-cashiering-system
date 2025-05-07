import React, { useState, useEffect, use } from 'react';
import {
    Box, TextField, Button, Typography, Paper, Avatar, Divider, Menu
} from '@mui/material';
import { axiosInstance } from '../config/globals';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/SidebarComponent';
import { useNavigate } from 'react-router-dom';
export default function EditProfilePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        avatarPreview: null,
        avatarFile: null,
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { user } = useAuth()
    useEffect(() => {
        if (!user) return;

        setForm(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            avatarPreview: user.avatarUrl || null
        }));

    }, [user]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({
                ...prev,
                avatarFile: file,
                avatarPreview: URL.createObjectURL(file),
            }));
        }
    };
    const { setUser } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        if (form.avatarFile) formData.append('avatar', form.avatarFile);
        if (passwordData.oldPassword) {
            formData.append('old_password', passwordData.oldPassword);
            formData.append('new_password', passwordData.newPassword);
            formData.append('new_password2', passwordData.confirmPassword);
        }

        try {
            await axiosInstance.put('/api/profile/update/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated!');
            axiosInstance.get('/api/auth-check/')
                .then(res => {
                    if (res.data.isAuthenticated) {
                        return axiosInstance.get('/api/profile/');
                    } else {
                        throw new Error('Not authenticated');
                    }
                })
                .then(r => { setUser(r.data) }) // set the user data in the context
                .catch(() => setUser(null));
            navigate('/home'); // Redirect to home or any other page after update
        } catch (err) {
            alert('Update failed');
            console.error(err);
        }
    };

    return (
        <Box
            sx={{
                width: '100vw', height: '100vh',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                bgcolor: '#f5f5f5',
            }}
        >
            <Sidebar />
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Edit Profile
                </Typography>

                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar src={form.avatarPreview} sx={{ width: 80, height: 80 }} />
                </Box>

                <form onSubmit={handleSubmit}>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Change Avatar
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    <TextField
                        name="email"
                        label="Email"
                        value={form.email}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />

                    <TextField
                        name="name"
                        label="Name"
                        value={form.name}
                        fullWidth
                        margin="normal"
                        required
                        onChange={handleFormChange}
                    />

                    <Divider sx={{ my: 2 }}>Change Password (Optional)</Divider>

                    <TextField
                        name="oldPassword"
                        label="Old Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handlePasswordChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
