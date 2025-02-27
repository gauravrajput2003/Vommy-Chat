const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupTestDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}_test`);
        await connection.query(`CREATE DATABASE ${process.env.DB_NAME}_test`);
        
        console.log('Test database reset successful');
        await connection.end();
    } catch (error) {
        console.error('Test database setup failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    setupTestDatabase();
}

module.exports = setupTestDatabase;