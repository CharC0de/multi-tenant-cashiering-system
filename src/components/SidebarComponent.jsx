// src/components/Sidebar.jsx
import React, { useEffect } from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Box,
    Avatar,
    Divider,
    Button
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { History, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';     // ← custom hook that calls useContext(AuthContext) :contentReference[oaicite:2]{index=2}
import { axiosInstance } from '../config/globals';

const drawerWidth = 240;

const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Cashiering', icon: <PointOfSaleIcon />, path: '/home/interface' },
    { text: 'Inventory', icon: <Inventory2Icon />, path: '/home/products' },
    { text: 'Transaction History', icon: <History />, path: '/home/transaction' },
    { text: 'Logout', icon: <Logout />, path: '/logout' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();                           // ← read user from context :contentReference[oaicite:3]{index=3}
    const [sbUser, setSbUser] = React.useState(null);
    useEffect(() => {
        if (user) {
            setSbUser(user);                               // ← set local state for user
        } else {

            axiosInstance.get('/api/auth-check/')
                .then(res => {
                    if (res.data.isAuthenticated) {
                        return axiosInstance.get('/api/profile/');
                    } else {
                        throw new Error('Not authenticated');
                    }
                })
                .then(r => { setSbUser(r.data) }) // set the user data in the context
                .catch(() => setSbUser(null));                              // ← set local state for user
        }
    }, [user])        // ← local state for user
    if (sbUser === null) {
        // while auth state is being determined
        return (
            <Box sx={{ width: drawerWidth, p: 2, textAlign: 'center' }}>
                <Typography>Loading user…</Typography>
            </Box>
        );
    }

    return (
        <Drawer
            variant="permanent"                               // permanent sidebar per MUI Drawer API :contentReference[oaicite:4]{index=4}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap>Cashiering App</Typography>
            </Toolbar>

            {/* User Info */}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Button onClick={() => navigate('/home/profile')} sx={{ textTransform: 'none' }}>
                    <Avatar
                        alt={sbUser.name}
                        src={sbUser.avatarUrl}
                        sx={{ width: 64, height: 64, mb: 1 }}
                    />
                </Button>

                <Typography variant="subtitle1" noWrap>
                    {sbUser.name}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                    {sbUser.email}
                </Typography>
            </Box>

            <Divider />

            {/* Navigation */}
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {navItems.map(({ text, icon, path }) => (
                        <ListItemButton
                            key={text}
                            selected={location.pathname === path}
                            onClick={() => navigate(path)}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
