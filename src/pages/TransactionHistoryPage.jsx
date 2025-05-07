import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Alert,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import Sidebar from '../components/SidebarComponent';
import { axiosInstance } from '../config/globals';

export default function TransactionHistoryPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch transaction history on mount
    useEffect(() => {
        axiosInstance.get('/api/history/transactions/')                        // :contentReference[oaicite:1]{index=1}
            .then(res => {
                setTransactions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load transactions.');
                setLoading(false);
            });
    }, []);

    function calculateTotal(items) {
        return items.reduce((sum, item) => sum + Number(item.price_at_transaction) * Number(item.quantity), 0);
    }

    return (
        <Box sx={{ display: 'flex' }} width="100vw" height="100vh">
            <Box sx={{ width: 240, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                    Transaction History
                </Typography>

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}

                {!loading && !error && transactions.length === 0 && (
                    <Typography>No transactions found.</Typography>
                )}

                {!loading && !error && transactions.map(txn => (
                    <Paper key={txn.id} sx={{ mb: 3, p: 2 }} elevation={3}>
                        <Typography variant="h6">Transaction ID: {txn.id}</Typography>
                        <List dense>
                            {txn.items.map((item, idx) => (
                                <ListItem key={idx}>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="square"
                                            src={item.product_image}             // your serializer field
                                            alt={item.product_name}
                                            sx={{ width: 48, height: 48, mr: 1 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.product_name}
                                        secondary={`₱${Number(item.price_at_transaction).toFixed(2)} × Qty: ${item.quantity}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle1">
                            Total: ₱{calculateTotal(txn.items).toFixed(2)}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
