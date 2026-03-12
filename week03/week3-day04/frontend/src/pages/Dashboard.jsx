import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { fadeUp, staggerFadeUp } from '../components/animations/gsapUtils';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, members: 0, active: 0, completed: 0 });
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, memRes] = await Promise.all([
          api.get('/projects'),
          api.get('/members')
        ]);
        
        setStats({
          projects: projRes.data.length,
          members: memRes.data.length,
          active: projRes.data.filter(p => p.status === 'active').length,
          completed: projRes.data.filter(p => p.status === 'completed').length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    fadeUp(heroRef.current?.children);
    if (statsRef.current) {
      staggerFadeUp(statsRef.current.children, { delay: 0.3 });
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box ref={heroRef} textAlign="center" mb={8}>
        <Typography variant="h2" gutterBottom color="primary.light">
          Manage Projects with Ease
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Your central hub for exploring project showcases, organizing team members, and driving things to completion.
        </Typography>
      </Box>

      <Grid container spacing={4} ref={statsRef}>
        {[
          { label: 'Total Projects', value: stats.projects, color: 'primary.main' },
          { label: 'Team Members', value: stats.members, color: 'secondary.main' },
          { label: 'Active Projects', value: stats.active, color: 'success.main' },
          { label: 'Completed', value: stats.completed, color: 'info.main' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h3" fontWeight="bold" color={stat.color} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
