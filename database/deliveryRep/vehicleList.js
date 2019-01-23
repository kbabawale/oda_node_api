const sequelize = require("../db");
const Sequelize = require("sequelize");

const VehicleList = sequelize.define("vehiclelist", {
   vehicle: { type: Sequelize.STRING(126) }
});

module.exports = VehicleList;
