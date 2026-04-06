import React, { useState, useContext, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Tabs, Tab } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerFadeUp } from '../components/animations/gsapUtils';
import { gsap } from 'gsap';

const Login = () => {
  const [tab, setTab] = useState(0);
  const { user, login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fadeUp(containerRef.current);
  }, []);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, clearProps: 'all' }
      );
    }
  }, [tab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (tab === 0) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      // Explicit navigation after state update
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper ref={containerRef} elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
          ProjectPortal
        </Typography>
        
        <Tabs value={tab} onChange={(e, newValue) => { setTab(newValue); setError(''); }} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}

        <Box component="form" onSubmit={handleSubmit} ref={formRef} display="flex" flexDirection="column" gap={2}>
          {tab === 1 && (
            <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
          )}
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 2 }}>
            {tab === 0 ? 'Login' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
