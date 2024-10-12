// seeder.js
const mongoose = require('mongoose');
const User = require('./models/User'); // User model ko import karein
require('dotenv').config();

// MongoDB connection string
const mongoURI = process.env.DB_URL;

// Seed Function
const seedUsers = async () => {
    try {
        await mongoose.connect(mongoURI);

        const user = new User({
            
            email: 'pradhan@gmail.com',
            password: 'pradhan123', // Yeh plain text password hai, production me hash karna mat bhoolna
        });

        await user.save();
        console.log('User created:', user);
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.connection.close();
    }
};

// Seeder ko run karein
seedUsers();
