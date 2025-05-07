import React, { useCallback, useEffect } from 'react';
import { Box, Button, Grid, Toolbar } from '@mui/material';
import Sidebar from '../components/SidebarComponent';
import RevenueGraph from '../components/dashboard/RevenueGraph';
import ProductsGrid from '../components/dashboard/ProductsGrid';
import { axiosInstance } from '../config/globals';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const [products, setProducts] = React.useState([]);
    const { user, fetchUser } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const fetchProducts = useCallback(async () => {

        if (!user) fetchUser();

        try {
            const res = await axiosInstance.get(`/api/products?email=${user.email}`);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    }, [user, fetchUser]); // State to hold the products data
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts]); // Empty dependency array to run only once on mount

    if (loading) return <p>Loading...</p>;

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar is fixed width */}
            <Sidebar />

            {/* Main content just flexes into the remaining space */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '80vw',
                    p: 2,
                }}
            >
                <Toolbar />


                <Grid
                    container
                    direction="column"
                    spacing={3}
                >
                    <Grid item xs={12} width={'100%'}>
                        <RevenueGraph />
                    </Grid>
                    <Grid item>
                        <Link to="/home/products" style={{ textDecoration: 'none' }}>

                            <ProductsGrid products={products} isEditable={false} />
                        </Link>

                    </Grid>
                </Grid>

            </Box>
        </Box>
    );
}
