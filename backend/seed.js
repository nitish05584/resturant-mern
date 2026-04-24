const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/categoryModel');
const Menu = require('./models/menuModel');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    await Category.deleteMany({});
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const categories = [
      {
        name: 'Biryani',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=600'
      },
      {
        name: 'Curries',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600'
      },
      {
        name: 'Tandoori',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600'
      },
      {
        name: 'Breads',
        image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600'
      }
    ];

    const savedCategories = await Category.insertMany(categories);
    console.log('✅ Categories added:', savedCategories.length);

    const menus = [
      {
        name: 'Hyderabadi Biryani',
        description: 'Authentic rice dish cooked with marinated meat and fragrant spices',
        price: 350,
        category: savedCategories[0]._id,
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=600',
        available: true
      },
      {
        name: 'Lucknowi Biryani',
        description: 'Aromatic biryani with tender meat and basmati rice',
        price: 320,
        category: savedCategories[0]._id,
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600',
        available: true
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato and butter sauce',
        price: 280,
        category: savedCategories[1]._id,
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600',
        available: true
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Cottage cheese in aromatic creamy sauce',
        price: 250,
        category: savedCategories[1]._id,
        image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600',
        available: true
      },
      {
        name: 'Rogan Josh',
        description: 'Aromatic meat curry with yogurt and spices',
        price: 290,
        category: savedCategories[1]._id,
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600',
        available: true
      },
      {
        name: 'Tandoori Chicken',
        description: 'Grilled chicken marinated in yogurt and spices',
        price: 320,
        category: savedCategories[2]._id,
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600',
        available: true
      },
      {
        name: 'Chicken Tikka',
        description: 'Juicy chicken pieces grilled to perfection',
        price: 240,
        category: savedCategories[2]._id,
        image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600',
        available: true
      },
      {
        name: 'Naan Bread',
        description: 'Soft and fluffy traditional Indian bread',
        price: 80,
        category: savedCategories[3]._id,
        image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600',
        available: true
      },
      {
        name: 'Garlic Naan',
        description: 'Naan bread topped with fresh garlic and herbs',
        price: 100,
        category: savedCategories[3]._id,
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=600',
        available: true
      },
      {
        name: 'Shahi Tukda',
        description: 'Rich dessert with bread, condensed milk and nuts',
        price: 150,
        category: savedCategories[3]._id,
        image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600',
        available: true
      }
    ];

    await Menu.insertMany(menus);
    console.log('✅ Menu items added:', menus.length);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedData();
