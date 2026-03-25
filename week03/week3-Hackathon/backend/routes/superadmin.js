const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.use(auth, checkRole(['superadmin']));

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: 'User not found' });
    if (user.role === 'superadmin') return res.status(403).send({ error: 'Cannot block superadmin' });
    
    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();
    res.send({ message: `User ${user.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
       return res.status(400).send({ error: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: 'User not found' });
    if (user.role === 'superadmin') return res.status(403).send({ error: 'Cannot change role of superadmin' });

    user.role = role;
    await user.save();
    res.send(user);
  } catch(error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const stockStats = await Product.aggregate([
      { $unwind: '$variants' },
      { $group: { _id: null, totalStock: { $sum: '$variants.stock' } } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      revenue: revenue.length > 0 ? revenue[0].total : 0,
      totalStock: stockStats.length > 0 ? stockStats[0].totalStock : 0
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
