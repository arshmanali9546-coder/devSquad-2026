const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/place', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { address } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ error: 'Cart is empty' });
    }

    let total = 0;
    const items = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.productId._id).session(session);
      const variant = product.variants.id(item.variantId);
      
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title} - ${variant.size}`);
      }

      // Reduce stock
      variant.stock -= item.quantity;
      await product.save({ session });

      total += variant.price * item.quantity;
      items.push({
        productId: product._id,
        variantId: variant._id,
        quantity: item.quantity,
        price: variant.price
      });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      total,
      address
    });

    await order.save({ session });

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).send(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
