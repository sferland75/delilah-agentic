import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';

// Import components
import Navigation from './components/Navigation';
import ClientList from './components/ClientList';
import TherapistList from './components/TherapistList';
import AssessmentList from './components/AssessmentList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3, 
              mt: 8,
              minHeight: '100vh',
              bgcolor: 'background.default'
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/therapists" element={<TherapistList />} />
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;