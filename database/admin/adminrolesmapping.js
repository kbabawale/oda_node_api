const sequelize = require("../db");
const Sequelize = require("sequelize");

const Adminrolesmapping = sequelize.define(
   "adminrolesmapping",
   {
      user_id: { type: Sequelize.STRING(126) },
      role_id: { type: Sequelize.INTEGER }
   },
   {
      timestamps: true
   }
);


module.exports = Adminrolesmapping;
