const sequelize = require("../db");
const Sequelize = require("sequelize");

const MarketLead = sequelize.define(
   "marketleads", 
   {
      fullName: { type: Sequelize.STRING(126) },
      mobile: { type: Sequelize.STRING(126) },
      refererCode: { type: Sequelize.STRING(126), unique: true, primaryKey: true }
   },
   {
      timestamps : true
   }

);

module.exports = MarketLead;
