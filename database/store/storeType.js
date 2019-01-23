const sequelize = require("../db");
const Sequelize = require("sequelize");

const StoreType = sequelize.define(
   "storetype", 
   {
      name: { type: Sequelize.STRING(126) }
   }
);

module.exports = StoreType;
