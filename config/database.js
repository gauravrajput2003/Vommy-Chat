const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 20,          // Increased from 5
            min: 5,           // Increased from 0
            acquire: 60000,   // Increased timeout
            idle: 10000,
            evict: 1000      // Added eviction running
        },
        define: {
            // Enable proper index handling
            timestamps: true,
            underscored: true
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        if (process.env.NODE_ENV === 'development') {
            // Drop and recreate tables
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await sequelize.sync({ force: true });
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('Database tables recreated successfully');
        } else {
            await sequelize.sync();
            console.log('Database synchronized');
        }
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

module.exports = { sequelize, connectDB };