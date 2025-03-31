'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Chip, 
  Divider, 
  TextField, 
  CircularProgress,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const ProductDetail = ({ product, isLoading, error }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { isAdmin } = useAuth();
  
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product?.stock) {
      setQuantity(value);
    }
  };
  
  const handleIncrement = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading product: {error}
      </Alert>
    );
  }
  
  if (!product) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Product not found.
      </Alert>
    );
  }
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 1,
              boxShadow: 1
            }}
            src={product.image_url || 'https://via.placeholder.com/500'}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip 
              label={product.category} 
              color="secondary" 
              variant="outlined" 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Chip 
              label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
              color={product.stock > 0 ? 'success' : 'error'} 
              size="small" 
            />
          </Box>
          
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Available: {product.stock} items
            </Typography>
          </Box>
          
          {product.stock > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: product.stock } }}
                  size="small"
                  sx={{ width: '70px' }}
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </Stack>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            fullWidth
            sx={{ mb: 2 }}
          >
            Add to Cart
          </Button>
          
          {isAdmin && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                href={`/admin/products/edit/${product.id}`}
                sx={{ mr: 1 }}
              >
                Edit Product
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductDetail; 