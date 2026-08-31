import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const recruiter = sequelize.define(
    'recruiter', {
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: {
                args: [1, 255],
                msg: "nom d'entreprise trop long, moins de 255 caractère sont tolèrés.",
            },
        },
    },
      localisation: {
        type: DataTypes.STRING,
        allowNull: false,
      }
});

module.export = recruiter;