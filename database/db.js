const Sequelize = require("sequelize");

const sequelize = new Sequelize("oda", "oda", "@Sun123", {
   host: "localhost",
   dialect: "postgres",
   timezone: "Africa/Lagos"
});

module.exports = sequelize;
