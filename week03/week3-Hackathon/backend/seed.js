const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    await User.deleteMany({});

    const teaImages = [
      'https://images.unsplash.com/photo-1594833240217-108bb6b34907?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1627490059371-332e60086c50?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1582793988950-747d9536cff1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1611077544837-7e793930b8e6?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1608249877405-b0cc30eaf7a5?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cad?auto=format&fit=crop&q=80&w=400'
    ];

    const sampleProducts = [
      {
        title: 'Ceylon Ginger Cinnamon chai tea',
        description: 'A lovely warming Chai tea with ginger cinnamon flavours.',
        category: 'Chai',
        flavor: 'Spicy',
        ingredients: 'Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.',
        caffeine: 'Medium',
        allergens: 'Nuts-free',
        origin: 'Iran',
        organic: true,
        vegan: true,
        image: teaImages[5],
        variants: [
          { size: '50 g bag', price: 3.90, stock: 100 },
          { size: '100 g bag', price: 6.90, stock: 50 },
          { size: '170 g bag', price: 10.90, stock: 20 },
        ]
      },
      {
        title: 'Earl Grey Reserve Black Tea',
        description: 'Classic blend infused with natural bergamot oil.',
        category: 'Black Tea',
        flavor: 'Citrus',
        caffeine: 'High',
        organic: true,
        vegan: true,
        image: teaImages[0],
        variants: [
          { size: '50 g bag', price: 4.50, stock: 80 },
          { size: '100 g bag', price: 8.00, stock: 60 },
        ]
      },
      {
        title: 'Jasmine Pearl Green Tea',
        description: 'Hand-rolled green tea leaves scented with fresh jasmine flowers.',
        category: 'Green Tea',
        flavor: 'Floral',
        caffeine: 'Low',
        origin: 'China',
        organic: true,
        image: teaImages[1],
        variants: [
          { size: '50 g bag', price: 8.90, stock: 30 },
          { size: '100 g bag', price: 16.50, stock: 20 },
        ]
      },
      {
        title: 'Ceremonial Matcha',
        description: 'Premium shade-grown green tea powder.',
        category: 'Matcha',
        flavor: 'Earthy',
        caffeine: 'High',
        origin: 'Japan',
        organic: true,
        image: teaImages[3],
        variants: [
          { size: '30 g tin', price: 29.90, stock: 15 },
        ]
      },
      {
        title: 'Chamomile Lavender Herbal',
        description: 'Calming blend for a perfect evening.',
        category: 'Herbal Tea',
        flavor: 'Floral',
        caffeine: 'Caffeine-free',
        organic: true,
        image: teaImages[4],
        variants: [
          { size: '50 g bag', price: 4.20, stock: 120 },
          { size: '100 g bag', price: 7.50, stock: 80 },
        ]
      },
      {
        title: 'Silver Needle White Tea',
        description: 'Delicate and sweet white tea made from only unwithered buds.',
        category: 'White Tea',
        flavor: 'Sweet',
        caffeine: 'Low',
        origin: 'China',
        organic: true,
        image: teaImages[2],
        variants: [
          { size: '50 g bag', price: 12.00, stock: 40 },
        ]
      },
      {
        title: 'Iron Goddess Oolong',
        description: 'Rich, roasted, and complex.',
        category: 'Oolong',
        flavor: 'Roasted',
        caffeine: 'Medium',
        origin: 'Taiwan',
        image: teaImages[6],
        variants: [
          { size: '50 g bag', price: 9.90, stock: 50 },
        ]
      },
      {
        title: 'Vanilla Rooibos',
        description: 'Naturally sweet and caffeine-free red tea.',
        category: 'Rooibos',
        flavor: 'Vanilla',
        caffeine: 'Caffeine-free',
        origin: 'South Africa',
        organic: true,
        image: teaImages[7],
        variants: [
          { size: '100 g bag', price: 6.50, stock: 90 },
        ]
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully!');

    // Create a superadmin
    const superadmin = new User({
      name: 'Super Admin',
      email: 'sadmin@test.com',
      password: 'password123',
      role: 'superadmin'
    });
    await superadmin.save();
    console.log('Superadmin created: sadmin@test.com / password123');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
