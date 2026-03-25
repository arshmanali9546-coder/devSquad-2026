const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., '50g bag', '100g bag'
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g., Black Tea, Green Tea
  flavor: { type: String },
  ingredients: { type: String },
  caffeine: { type: String },
  allergens: { type: String },
  origin: { type: String },
  organic: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  image: { type: String }, // image URL
  variants: [variantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
