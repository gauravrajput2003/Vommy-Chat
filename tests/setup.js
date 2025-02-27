const { sequelize } = require('../config/database');
const redis = require('../config/redis');
require('dotenv').config();

jest.setTimeout(10000);

beforeAll(async () => {
    try {
        process.env.NODE_ENV = 'test';
        process.env.PORT = 5001;

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        await redis.flushall();
        
        console.log('✓ Test environment ready');
    } catch (error) {
        console.error('✗ Test setup failed:', error);
        throw error;
    }
});

beforeEach(async () => {
    try {
        await Promise.all([
            sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
            redis.flushall()
        ]);
        
        for (const model of Object.values(sequelize.models)) {
            await model.destroy({ truncate: true, force: true });
        }
        
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
        console.error('✗ Test reset failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await Promise.all([
            sequelize.close(),
            redis.quit()
        ]);
    } catch (error) {
        console.error('✗ Test teardown failed:', error);
        throw error;
    }
});

module.exports = { sequelize, redis };