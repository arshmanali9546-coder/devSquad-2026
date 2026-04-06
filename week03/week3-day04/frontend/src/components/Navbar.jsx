import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          ProjectPortal
        </Typography>
        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={user.role === 'company_user' ? 'Company' : 'Team Member'} 
              size="small" 
              color={user.role === 'company_user' ? 'primary' : 'secondary'}
              sx={{ mr: 2 }}
            />
            <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
            <Button color="inherit" onClick={() => navigate('/projects')}>Projects</Button>
            {user.role === 'company_user' && (
              <Button color="inherit" onClick={() => navigate('/members')}>Team</Button>
            )}
            <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ ml: 2 }}>Logout</Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
