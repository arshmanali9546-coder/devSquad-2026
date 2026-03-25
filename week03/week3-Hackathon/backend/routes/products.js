const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      flavor, 
      origin,
      organic,
      q, // Search query
      minPrice, 
      maxPrice,
      sort
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (flavor) filter.flavor = flavor;
    if (origin) filter.origin = origin;
    if (organic === 'true') filter.organic = true;
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
       filter['variants.price'] = {};
       if (minPrice) filter['variants.price'].$gte = Number(minPrice);
       if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { 'variants.0.price': 1 };
    else if (sort === 'price_desc') sortOption = { 'variants.0.price': -1 };
    else sortOption = { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ error: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
