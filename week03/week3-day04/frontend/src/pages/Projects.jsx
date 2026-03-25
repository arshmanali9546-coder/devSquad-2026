import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Autocomplete, Chip, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { staggerFadeUp, scaleIn } from '../components/animations/gsapUtils';
import { gsap } from 'gsap';
import { AuthContext } from '../context/AuthContext';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    techStack: '', 
    status: 'active',
    teamMembers: [] 
  });
  const gridRef = useRef(null);

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (gridRef.current && res.data.length > 0) {
        staggerFadeUp(gridRef.current.children);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setAllMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack.join(', '),
        status: project.status,
        teamMembers: project.teamMembers || []
      });
    } else {
      setCurrentProject(null);
      setFormData({ title: '', description: '', techStack: '', status: 'active', teamMembers: [] });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
        teamMembers: formData.teamMembers.map(m => m.id || m)
      };
      
      if (currentProject) {
        await api.put(`/projects/${currentProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      handleClose();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary" fontWeight="bold">Projects</Typography>
        {user?.role === 'company_user' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            New Project
          </Button>
        )}
      </Box>

      <Grid container spacing={3} ref={gridRef}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard 
              project={project} 
              onEdit={handleOpen} 
              onDelete={user?.role === 'company_user' ? handleDelete : null} 
            />
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
        <DialogTitle>{currentProject ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={user?.role !== 'company_user'}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Tech Stack (comma separated)"
            fullWidth
            margin="normal"
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          />
          
          {user?.role === 'company_user' && (
            <Autocomplete
              multiple
              options={allMembers}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={formData.teamMembers}
              onChange={(event, newValue) => {
                setFormData({ ...formData, teamMembers: newValue });
              }}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name} ({option.email})
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Assign Team Members" placeholder="Members" margin="normal" />
              )}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects;
