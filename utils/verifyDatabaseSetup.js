const { sequelize, connectDB } = require('../config/database');
const User = require('../models');
const Referral = require('../models/Referral');

const verifyDatabaseSetup = async () => {
    try {
        // Connect and sync database
        await connectDB();
        
        // Verify tables exist
        const [tables] = await sequelize.query('SHOW TABLES');
        console.log('\nDatabase Tables:');
        console.table(tables);

        // Verify Referrals structure
        const [referralColumns] = await sequelize.query('DESCRIBE Referrals');
        console.log('\nReferrals Table Structure:');
        console.table(referralColumns);

        // Verify Users structure
        const [userColumns] = await sequelize.query('DESCRIBE Users');
        console.log('\nUsers Table Structure:');
        console.table(userColumns);

        // Verify indexes
        const [referralIndexes] = await sequelize.query('SHOW INDEX FROM Referrals');
        console.log('\nReferrals Table Indexes:');
        console.table(referralIndexes);

        console.log('✓ Database verification completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database verification failed:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

// Run verification
verifyDatabaseSetup();