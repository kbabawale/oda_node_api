const sequelize = require("../db");
const Sequelize = require("sequelize");

const Category = sequelize.define(
   "category",
   {
      name: { type: Sequelize.STRING(126) }
   },
   {
      timestamps: true
   }
);

module.exports = Category;
