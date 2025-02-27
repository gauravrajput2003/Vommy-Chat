const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Referral = sequelize.define('Referral', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    referrerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    referredUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    code: {  // Changed from referralCode to code
        type: DataTypes.STRING(8),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'successful', 'expired'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['code']  // Updated index field
        }
    ]
});

module.exports = Referral;