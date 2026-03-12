import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import MemberCard from '../components/MemberCard';
import { staggerFadeUp, scaleIn } from '../components/animations/gsapUtils';
import { gsap } from 'gsap';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Members = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const gridRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
      if (gridRef.current && res.data.length > 0) {
        staggerFadeUp(gridRef.current.children);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        password: '' // Don't show old password
      });
    } else {
      setCurrentMember(null);
      setFormData({ name: '', email: '', password: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      if (currentMember) {
        await api.put(`/members/${currentMember.id}`, formData);
      } else {
        await api.post('/members', formData);
      }
      
      // GSAP notification timeline emulation
      gsap.timeline()
        .to('.notification-banner', { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' })
        .to('.notification-banner', { y: -50, opacity: 0, duration: 0.5, delay: 2 });
        
      handleClose();
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (user && user.role !== 'company_user') {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Hidden banner for GSAP notification */}
      <Box className="notification-banner" sx={{ 
        position: 'fixed', top: 20, right: 20, zIndex: 9999, 
        bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 2,
        opacity: 0, transform: 'translateY(-50px)'
      }}>
        Member saved successfully!
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="secondary" fontWeight="bold">Team</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Member
        </Button>
      </Box>

      <Grid container spacing={3} ref={gridRef}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <MemberCard member={member} onEdit={handleOpen} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        TransitionProps={{
          onEntered: (node) => scaleIn(node)
        }}
      >
        <DialogTitle>{currentMember ? 'Edit Member' : 'New Member'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label={currentMember ? "New Password (Leave blank to keep same)" : "Password"}
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="secondary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Members;
