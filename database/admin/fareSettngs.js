const sequelize = require("../db");
const Sequelize = require("sequelize");

const Settings = sequelize.define("faresettings", {
    vehicleId: {
        type: Sequelize.INTEGER,
        unique: true
    },
    baseFare: {
        type: Sequelize.FLOAT(10, 2)
    },
    perKm: {
        type: Sequelize.FLOAT(10, 2)
    },
    perMin: {
        type: Sequelize.FLOAT(10, 2)
    }
})

module.exports = Settings