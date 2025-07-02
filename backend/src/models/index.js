'use strict';
const fs       = require('fs');
const path     = require('path');
const Sequelize= require('sequelize');
const basename = path.basename(__filename);
const env      = process.env.NODE_ENV || 'development';
const config   = require('../../config/config.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = { sequelize, Sequelize };

fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));
    let model;

    // if the export is a function(factory), call it
    if (typeof modelDef === 'function' && modelDef.length === 2) {
      model = modelDef(sequelize, Sequelize.DataTypes);
    } else {
      // assume it's a class extending Model
      model = modelDef;
      model.init(model.rawAttributes || model.attributes, {
        sequelize,
        modelName: model.name,
        tableName: model.tableName || undefined,
      });
    }

    db[model.name] = model;
  });

Object.values(db)
  .filter(m => typeof m.associate === 'function')
  .forEach(m => m.associate(db));

module.exports = db;
