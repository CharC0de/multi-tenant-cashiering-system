import React, { useCallback, useEffect, useState } from 'react';
import {
    Box, Grid, Toolbar, Fab, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, TextField, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/SidebarComponent';
import ProductsGrid from '../components/dashboard/ProductsGrid';
import { axiosInstance } from '../config/globals';
import { useAuth } from '../context/AuthContext';

export default function ProductsPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        image: null,
        name: '',
        price: '',
        quantity: '',
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const { user } = useAuth();
    const fetchProducts = useCallback(async () => {

        if (!user) return;

        try {
            const res = await axiosInstance.get(`/api/products?email=${user.email}`);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    }, [user]);
    const handleAddProduct = async () => {


        // build FormData for multipart
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('quantity', formData.quantity);
        if (formData.image) data.append('image', formData.image);

        try {
            await axiosInstance.post('/api/products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });    // create via DRF viewset
            setOpenDialog(false);
            setFormData({ image: null, name: '', price: '', quantity: '' });
            fetchProducts(); // refresh product list
        } catch (err) {
            console.error('Add product failed', err);
            alert('Could not add product');
        }

    };

    const handleClearForm = () => { setOpenDialog(false); setFormData({ image: null, name: '', price: '', quantity: '' }); setImagePreview(null); }

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) return <p>Loading...</p>;


    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            overflow: 'auto',
        }} >
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                }}
                width={'100%'}
            >
                <Toolbar />

                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <ProductsGrid products={products} onProductDeleted={fetchProducts} onProductUpdated={fetchProducts} isEditable={true} />
                </Box>
                <Fab
                    color="primary"
                    aria-label="add-product"
                    sx={{
                        position: 'fixed',
                        bottom: (theme) => theme.spacing(3),
                        right: (theme) => theme.spacing(3),
                    }}
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon />
                </Fab>

                {/* Add Product Dialog */}

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Add Product</DialogTitle>

                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <InputLabel>Image</InputLabel>
                        {imagePreview && (
                            <Box
                                component="img"
                                src={imagePreview}
                                alt="Preview"
                                sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                            />
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClearForm}>Cancel</Button>
                        <Button onClick={handleAddProduct} variant="contained" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
