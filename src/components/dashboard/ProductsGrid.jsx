import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import { axiosInstance } from '../../config/globals';

export default function ProductsGrid({
    products,
    onProductUpdated,
    onProductDeleted,
    isEditable = false,
}, ...props) {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        imageFile: null,
        imagePreview: ''
    });
    products = products || [];
    const handleOpen = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            imageFile: null,
            imagePreview: product.image
        });
        setEditMode(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
        setEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageFile' && files[0]) {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async () => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('quantity', formData.quantity);
        if (formData.imageFile) data.append('image', formData.imageFile);

        try {
            const res = await axiosInstance.patch(
                `/api/products/${selectedProduct.id}/`,
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            onProductUpdated(res.data);
            handleClose();
        } catch (err) {
            console.error('Failed to update product', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/products/${id}/`);
            onProductDeleted(id);
            handleClose();
        } catch (err) {
            console.error('Failed to delete product', err);
        }
    };

    return (
        <Paper sx={{ p: 2, width: '100%' }} elevation={3} {...props}>
            <Typography variant="h6" gutterBottom>
                Products
            </Typography>

            <Grid container spacing={2} justifyContent="start" alignItems="stretch">
                {products.map(prod => (
                    <Grid item key={prod.id} xs={12} sm="auto">
                        <Card sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
                            <CardMedia component="img" height="200" image={prod.image} alt={prod.name} />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{prod.name}</Typography>
                                <Typography color="text.secondary">Price: {prod.price}</Typography>
                                <Typography color="text.secondary">Qty: {prod.quantity}</Typography>
                            </CardContent>
                            {isEditable && (
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Button size="small" onClick={() => handleOpen(prod)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(prod.id)}>Delete</Button>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                {selectedProduct && (
                    <>
                        <DialogTitle>{editMode ? 'Edit Product' : selectedProduct.name}</DialogTitle>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {/* Image preview */}
                            {formData.imagePreview && (
                                <Box component="img"
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                                />
                            )}

                            {editMode ? (
                                <>
                                    {/* Image file chooser */}
                                    <Button variant="outlined" component="label">
                                        Change Image
                                        <input
                                            name="imageFile"
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleChange}
                                        />
                                    </Button>
                                    <TextField name="name" label="Name" value={formData.name}
                                        onChange={handleChange} fullWidth />
                                    <TextField name="price" label="Price" type="number"
                                        value={formData.price} onChange={handleChange} fullWidth />
                                    <TextField name="quantity" label="Quantity" type="number"
                                        value={formData.quantity} onChange={handleChange} fullWidth />
                                </>
                            ) : (
                                <>
                                    <Typography><strong>Price:</strong> {selectedProduct.price}</Typography>
                                    <Typography><strong>Quantity:</strong> {selectedProduct.quantity}</Typography>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                            {editMode
                                ? <Button variant="contained" onClick={handleUpdate}>Save</Button>
                                : <Button variant="contained" onClick={() => setEditMode(true)}>Edit</Button>
                            }
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Paper>
    );
}
