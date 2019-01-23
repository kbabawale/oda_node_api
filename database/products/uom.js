const sequelize = require("../db");
const Sequelize = require("sequelize");

const UOM = sequelize.define(
   "uom",
   {
      unit: { type: Sequelize.STRING(126) },
      status: { type: Sequelize.INTEGER }
   },
   {
      timestamps: true
   }
);

module.exports = UOM;
