'use client';

import React, { useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Pagination, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField
} from '@mui/material';
import ProductCard from './ProductCard';
import useProductStore from '../../store/productStore';

const ProductList = () => {
  const { 
    products, 
    categories, 
    isLoading, 
    error, 
    filters, 
    pagination,
    fetchProducts,
    fetchCategories,
    setFilters,
    resetFilters,
    setPage
  } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  const handleCategoryChange = (event) => {
    setFilters({ category: event.target.value });
  };
  
  const handlePriceChange = (event, newValue) => {
    setFilters({ minPrice: newValue[0], maxPrice: newValue[1] });
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  if (isLoading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && products.length === 0) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading products: {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={filters.category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography id="price-range-slider" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                aria-labelledby="price-range-slider"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">${filters.minPrice}</Typography>
                <Typography variant="body2">${filters.maxPrice}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Product Grid */}
      {products.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No products found matching your criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductList; 