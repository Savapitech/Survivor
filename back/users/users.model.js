import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
const profil = require('../profils/profils.model');

const user = sequelize.define(
    'user', {
      email: {
        Type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: 'identifiantConnexion',
            msg: 'Un compte avec cet identifiant de connexion existe déjà.',
        },
        validate: {
            isEmail: {
                args: true,
                msg: "mail invalide.",
            },
            len: {
                args: [1, 320],
                msg: "le mail doit contenir moins de 320 caractères.",
            },
        },
    },
      password: {
        Type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
      id: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
      role: {
        type: DataTypes.ENUM('admin', 'seeker', 'recruiter'),
        allowNull: false,
    },
});

user.hasOne(profil);

module.export = user;