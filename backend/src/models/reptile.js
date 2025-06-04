const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reptile = sequelize.define(
  'Reptile',
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    species: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    age: DataTypes.STRING(50),
    location: DataTypes.STRING(100),
    sex: DataTypes.STRING(20),
    traits: DataTypes.STRING(100),
    bio: DataTypes.TEXT,
    requirements: DataTypes.TEXT,                    // ← Added
    image_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    }
  },
  {
    tableName: 'reptiles',
    timestamps: false
  }
);

module.exports = Reptile;