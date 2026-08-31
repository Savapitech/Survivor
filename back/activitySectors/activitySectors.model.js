import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const activitySector = sequelize.define(
    'activitySector', {
        activitySector: {
            type: DataTypes.STRING,
            allowNull: false,
            valid: {
                notEmpty: true,
            },
        },
});

module.export = activitySector;