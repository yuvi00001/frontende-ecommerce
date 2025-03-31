'use client';

import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip,
  Box
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/cartStore';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
  };
  
  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 3
        },
        cursor: 'pointer'
      }}
      onClick={handleViewDetails}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image_url || 'https://via.placeholder.com/300'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description && product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Chip 
            label={product.category} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          fullWidth
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 