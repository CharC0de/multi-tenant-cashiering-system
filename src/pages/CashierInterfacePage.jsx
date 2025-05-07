import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import Sidebar from '../components/SidebarComponent';
import { axiosInstance } from '../config/globals';
import { Inventory } from '@mui/icons-material';
const CashierInterfacePage = () => {
  const [products, setProducts] = useState([]);           // fetched list
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);

  // 1) fetch & search products
  useEffect(() => {
    const fetch = () => axiosInstance
      .get('/api/products/search/', { params: { q: searchQuery } })
      .then(r => setProducts(r.data))
      .catch(console.error);

    const id = setTimeout(fetch, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // 2) when you click on a product card, mark it selected
  const handleSelect = (p) => {
    setSelectedProduct(p);
    setQuantity(1);
  };

  // 3) add selectedProduct → cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const newItem = {
      ...selectedProduct,
      quantity,
      total: selectedProduct.price * quantity
    };
    setCart(c => [...c, newItem]);
    setQuantity(1);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.total, 0);

  // 4) finalize → POST transaction
  const finalizeTransaction = async () => {
    const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity }));
    try {
      const res = await axiosInstance.post('/api/transactions/', { items });
      alert(`Transaction #${res.data.id} created`);
      setCart([]);
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      <Box sx={{ flexGrow: 1, width: 'calc(100vw - 240px)', p: 3, overflow: 'auto' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* LEFT: search + cart */}
          <Grid item xs={12} md={8} sx={{ overflowY: 'auto', width: '80%' }}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <Typography variant="h6" gutterBottom>Products</Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {products.map(p => (
                <Grid item key={p.id} xs={4}>
                  <Card
                    onClick={() => handleSelect(p)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedProduct?.id === p.id ? '2px solid blue' : 'none'
                    }}
                  >
                    <CardMedia component="img" height="80" image={p.image} alt={p.name} />
                    <CardContent><Typography noWrap>{p.name}</Typography></CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom>Cart</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell><TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell><TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell><img src={item.image} alt="" width={50} /></TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                    <TableCell>${Number(item.total).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {Array.from({ length: Math.max(0, 15 - cart.length) }).map((_, i) => (
                  <TableRow key={`blank-${i}`}><TableCell colSpan={5}>&nbsp;</TableCell></TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>Total</strong></TableCell>
                  <TableCell><strong>${Number(cartTotal).toFixed(2)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* RIGHT: details & actions */}
          <Grid
            item xs={12} md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

              {selectedProduct?.image ? <CardMedia
                component="img"
                height="140"
                sx={{ width: 140, height: 140, objectFit: 'cover', margin: 'auto', pt: 1, alignSelf: "center", border: "solid", borderColor: "#e1e1e1" }}
                image={selectedProduct?.image}
                alt={selectedProduct?.name}
              /> : <Inventory color='disabled' sx={{ width: 140, height: 140, margin: 'auto', alignSelf: "center", border: "solid", borderColor: "#e1e1e1" }} />}
              <CardContent>
                <Typography variant="h6">{selectedProduct?.name || 'Select a product'}</Typography>
                <Typography color="text.secondary">
                  Price: ${isNaN(Number(selectedProduct?.price)?.toFixed(2)) ? Number(0).toFixed(2) : Number(selectedProduct?.price)?.toFixed(2)}
                </Typography>
                <Typography color="text.secondary">
                  Stock: {selectedProduct?.quantity || 0}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  fullWidth
                  sx={{ mt: 2 }}
                  slotProps={{
                    input: {
                      min: 1,
                      max: selectedProduct?.quantity || 1
                    }

                  }}
                  disabled={!selectedProduct}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!selectedProduct}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
              onClick={finalizeTransaction}
              disabled={!cart.length}
            >
              Finalize Transaction
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CashierInterfacePage;
