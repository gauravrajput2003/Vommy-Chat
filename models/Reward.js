const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reward = sequelize.define('Reward', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    type: {
        type: DataTypes.ENUM('referral', 'signup'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'claimed', 'expired'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

Reward.associate = function(models) {
    Reward.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

module.exports = Reward;