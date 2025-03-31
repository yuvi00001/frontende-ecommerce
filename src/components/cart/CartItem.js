'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Paper,
  Grid,
  Stack
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import useCartStore from '../../store/cartStore';

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCartStore();
  
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      updateItemQuantity(item.id, value);
    }
  };
  
  const handleIncrement = () => {
    updateItemQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.id);
  };
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} sm={2}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 1
            }}
            src={item.image_url || 'https://via.placeholder.com/100'}
            alt={item.name}
          />
        </Grid>
        <Grid item xs={9} sm={4}>
          <Typography variant="subtitle1" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price.toFixed(2)} each
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton 
              size="small" 
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              value={item.quantity}
              onChange={handleQuantityChange}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: '60px' }}
            />
            <IconButton 
              size="small" 
              onClick={handleIncrement}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" component="div">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
          <IconButton 
            color="error" 
            size="small" 
            onClick={handleRemove}
            aria-label="remove from cart"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItem; 