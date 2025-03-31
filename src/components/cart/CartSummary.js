'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const CartSummary = () => {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();
  const { user } = useAuth();
  
  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };
  
  // Calculate subtotal, tax, and shipping
  const subtotal = totalPrice;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax (10%)" />
          <Typography variant="body1">${tax.toFixed(2)}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body1">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </ListItem>
      </List>
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<ShoppingBagIcon />}
        onClick={handleCheckout}
        disabled={items.length === 0}
        sx={{ mt: 3 }}
      >
        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Secure checkout powered by our payment processor
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartSummary; 