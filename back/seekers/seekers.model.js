import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
const competence = require("../competences/competences.model");
const activitySector = require("../activitySectors/activitySectors.model");
const localisation = require("../localisations/localisations.model");

const seeker = sequelize.define(
    'seeker', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
      certification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
      video: {
        type: DataTypes
      }
});

seeker.hasMany(localisation);
seeker.hasMany(competence);
seeker.hasMany(activitySector);

module.export = seeker;