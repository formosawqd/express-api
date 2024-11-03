'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ceshi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ceshi.init({
    name: DataTypes.STRING,
    rank: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ceshi',
  });
  return Ceshi;
};