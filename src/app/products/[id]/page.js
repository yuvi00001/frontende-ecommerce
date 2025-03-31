'use client';

import React, { useEffect } from 'react';
import { Container, Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import ProductDetail from '../../../components/products/ProductDetail';
import useProductStore from '../../../store/productStore';

const ProductDetailPage = ({ params }) => {
  const router = useRouter();
  const { currentProduct, fetchProductById, isLoading, error } = useProductStore();
  const productId = params.id;
  
  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to Products
          </Button>
        </Box>
        
        <ProductDetail 
          product={currentProduct} 
          isLoading={isLoading} 
          error={error} 
        />
      </Container>
    </Layout>
  );
};

export default ProductDetailPage; 