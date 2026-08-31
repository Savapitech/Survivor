import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const localisation = sequelize.define(
    'localisation', {
        localisation: {
            type: DataTypes.STRING,
            allowNull: false,
            valid: {
                notEmpty: true,
            },
        },
});

module.export = localisation;