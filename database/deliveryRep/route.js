const sequelize = require("../db");
const Sequelize = require("sequelize");

const Route = sequelize.define("route", {
   store_id: { type: Sequelize.STRING(126) },
   task_id: { type: Sequelize.STRING(126) },
   status: { type: Sequelize.STRING, defaultValue: "PENDING" } //values = PENDING, PICK UP START, PICK UP END, DROP OFF START, DROP OFF END
});

module.exports = Route;
