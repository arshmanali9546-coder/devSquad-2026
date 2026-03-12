const express = require('express');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// Get projects based on role
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.user.role === 'company_user') {
      // Company user sees everything
      projects = await Project.find().populate('teamMembers', 'name email role');
    } else {
      // Team member only sees their assigned projects
      projects = await Project.find({ teamMembers: req.user.user.id }).populate('teamMembers', 'name email role');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a project (Only company_user can create)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.user.role !== 'company_user') {
      return res.status(403).json({ message: 'Only company users can create projects' });
    }

    const { title, description, techStack, status, teamMembers } = req.body;
    const newProject = new Project({
      title,
      description,
      techStack: techStack || [],
      status: status || 'active',
      teamMembers: teamMembers || []
    });
    
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a project (Company user or assigned Team member can update)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, techStack, status, teamMembers } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Permission check: company_user OR if it's a team_member, they must be assigned to this project
    if (req.user.user.role !== 'company_user' && !project.teamMembers.includes(req.user.user.id)) {
      return res.status(403).json({ message: 'You do not have permission to edit this project' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.techStack = techStack || project.techStack;
    project.status = status || project.status;
    
    // Only company_user can reassess team members
    if (req.user.user.role === 'company_user' && teamMembers) {
      project.teamMembers = teamMembers;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a project (Only company_user can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.user.role !== 'company_user') {
      return res.status(403).json({ message: 'Only company users can delete projects' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
