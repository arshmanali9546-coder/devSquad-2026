const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send({ error: 'Product not found' });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).send({ error: 'Variant not found' });
    if (variant.stock < quantity) {
      return res.status(400).send({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId && p.variantId.toString() === variantId);
    if (itemIndex > -1) {
      let currentItem = cart.items[itemIndex];
      if (variant.stock < currentItem.quantity + quantity) {
         return res.status(400).send({ error: 'Insufficient stock to append' });
      }
      currentItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    await cart.save();
    
    cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/update', auth, async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).send({ error: 'Cart not found' });

    const product = await Product.findById(productId);
    const variant = product.variants.id(variantId);
    if (variant.stock < quantity) {
      return res.status(400).send({ error: 'Insufficient stock' });
    }

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId && p.variantId.toString() === variantId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      return res.json(cart);
    }
    res.status(404).send({ error: 'Item not in cart' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/remove/:productId/:variantId', auth, async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).send({ error: 'Cart not found' });

    cart.items = cart.items.filter(p => !(p.productId.toString() === productId && p.variantId.toString() === variantId));
    await cart.save();
    
    cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
