import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const competence = sequelize.define(
    'competence', {
        competence: {
            type: DataTypes.STRING,
            allowNull: false,
            valid: {
                notEmpty: true,
            },
        },
});

module.export = competence;