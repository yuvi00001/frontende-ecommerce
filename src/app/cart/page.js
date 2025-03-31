'use client';

import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  Divider,
  Alert
} from '@mui/material';
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
  const { items, totalItems, clearCart, fetchCart, isLoading } = useCartStore();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is logged in, fetch cart from backend
    if (user) {
      fetchCart();
    }
  }, [user]);
  
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Your Shopping Cart
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading your cart...</Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Your cart is empty.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/products"
              startIcon={<ShoppingBagIcon />}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  href="/products"
                >
                  Continue Shopping
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CartSummary />
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default CartPage; 