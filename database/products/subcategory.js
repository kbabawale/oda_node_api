const sequelize = require("../db");
const Sequelize = require("sequelize");
let Category = require("./category");

const SubCategory = sequelize.define("subcategory", {
   name: { type: Sequelize.STRING(126) }
});

Category.hasMany(SubCategory);

module.exports = SubCategory;
