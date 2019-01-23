const sequelize = require("../db");
const Sequelize = require("sequelize");

const Location = sequelize.define("deliveryRepLocation", {
   deliveryRepUid: { type: Sequelize.STRING(126) },
   available: { type: Sequelize.BOOLEAN, defaultValue: true },
   location: { type: Sequelize.GEOMETRY }
});

module.exports = Location;
