'use client';

import React from 'react';
import { Container } from '@mui/material';
import Layout from '../../components/layout/Layout';
import ProductList from '../../components/products/ProductList';

const ProductsPage = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <ProductList />
      </Container>
    </Layout>
  );
};

export default ProductsPage; 