'use client';

import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return null; // Or a loading spinner
  }
  
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <LoginForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage; 