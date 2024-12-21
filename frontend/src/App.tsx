import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import TherapistList from './components/TherapistList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './auth/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      {isAuthenticated && <Navigation />}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: isAuthenticated ? 8 : 0 }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <ClientList />
              </ProtectedRoute>
            } />
            <Route path="/therapists" element={
              <ProtectedRoute>
                <TherapistList />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;