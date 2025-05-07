import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { axiosInstance } from '../../config/globals';  // your configured axios

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function RevenueGraph() {
    const [labels, setLabels] = useState([]);
    const [dataPoints, setDataPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosInstance.get('/api/history/revenue/')                         // fetch from your API :contentReference[oaicite:0]{index=0}
            .then(res => {
                console.log(res.data); // check the response structure
                setLabels(res.data.map(r => r.month));
                setDataPoints(res.data.map(r => r.revenue));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load revenue data.');
                setLoading(false);
            });
    }, []);

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;   // :contentReference[oaicite:1]{index=1}
    if (error) return <Alert severity="error">{error}</Alert>;                           // :contentReference[oaicite:2]{index=2}

    const chartData = {
        labels,
        datasets: [{
            label: 'Revenue ($)',
            data: dataPoints,
            borderColor: 'blue',
            tension: 0.4,
            fill: false,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
    };

    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Revenue Over Time
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
                <Line data={chartData} options={options} />
            </Box>
        </Paper>
    );
}
