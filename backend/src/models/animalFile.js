const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class AnimalFile extends Model {}

AnimalFile.init(
  {
    reptile_id: { type: DataTypes.INTEGER, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "AnimalFile",
    tableName: "animal_files",
    timestamps: false,
  },
);

module.exports = AnimalFile;
