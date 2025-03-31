'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import useProductStore from '../store/productStore';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const { products, fetchProducts, isLoading } = useProductStore();
  
  useEffect(() => {
    // Fetch featured products (first page with limit)
    fetchProducts({ page: 1, limit: 8 });
  }, []);
  
  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to E-Shop
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            Your one-stop shop for all your needs
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            href="/products"
            sx={{ mt: 2 }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>
      
      {/* Featured Products */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Products
        </Typography>
        
        <Grid container spacing={4}>
          {products.slice(0, 8).map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            href="/products"
          >
            View All Products
          </Button>
        </Box>
      </Container>
      
      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Shop by Category
          </Typography>
          
          <Grid container spacing={3}>
            {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((category) => (
              <Grid item key={category} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://source.unsplash.com/random/300x200?${category.toLowerCase()}`}
                    alt={category}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link}
                      href={`/products?category=${category.toLowerCase()}`}
                    >
                      Browse {category}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}
