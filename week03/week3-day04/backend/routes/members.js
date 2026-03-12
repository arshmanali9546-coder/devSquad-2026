const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all team members
router.get('/', auth, async (req, res) => {
  try {
    const members = await User.find({ role: 'team_member' }).select('-password');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a member (only company_user can do this)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.user.role !== 'company_user') {
      return res.status(403).json({ message: 'Only company users can add team members' });
    }

    const { name, role, email, password } = req.body;

    let member = await User.findOne({ email });
    if (member) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    member = new User({
      name,
      email,
      password: hashedPassword,
      role: 'team_member'
    });
    
    await member.save();
    
    const memberResponse = member.toObject();
    delete memberResponse.password;
    res.json(memberResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a member
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.user.role !== 'company_user') {
      return res.status(403).json({ message: 'Only company users can update team members' });
    }

    const { name, role, email, password } = req.body;

    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.name = name || member.name;
    member.email = email || member.email;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(password, salt);
    }

    await member.save();
    const memberResponse = member.toObject();
    delete memberResponse.password;
    res.json(memberResponse);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a member
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.user.role !== 'company_user') {
      return res.status(403).json({ message: 'Only company users can delete team members' });
    }

    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
