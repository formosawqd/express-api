"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "标题必须存在" }, // 不允许为空
          notEmpty: { msg: "标题不能为空" }, // 不允许空字符串
          len: {
            args: [2, 45], // 仅允许长度在2到45之间的值
            msg: "长度在2到45个字",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "内容必须存在" }, // 不允许为空
          notEmpty: { msg: "内容不能为空" }, // 不允许空字符串
          len: {
            args: [2, 45], // 仅允许长度在2到45之间的值
            msg: "长度在2到45个字",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
