import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
const recruiter = require("../recruiters/recruiters.model")
const seeker = require("../seekers/seekers.model")

const profil = sequelize.define(
    "profil", {
      targetId: DataTypes.INTEGER,
      targetType: DataTypes.STRING,
      customProfil: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.profilType === 'seeker') return this.seeker;
            if (this.profilType === 'recruiter') return this.recruiter;
            return null;
        },
        allowNull: false,
    }
});

profil.hasOne(recruiter, {foreignKey: 'targetId', constraints: false, as: 'recruiter'});
profil.hasOne(seeker, {foreignKey: 'targetId', constraints: false, as: 'seeker'});

module.export = profil;