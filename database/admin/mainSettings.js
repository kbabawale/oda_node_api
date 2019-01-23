const sequelize = require("../db");
const Sequelize = require("sequelize");

const MainSettings = sequelize.define("mainsettings", {
    TxPercentage: {
        type: Sequelize.FLOAT(2, 2),
        defaultValue: 1.05
    },
    maximum: {
        type: Sequelize.FLOAT(10, 2),
        defaultValue: 5000.00
    },
    minimum: {
        type: Sequelize.FLOAT(10, 2),
        defaultValue: 100.00
    },
    bufferPercentage: {
        type: Sequelize.FLOAT(2, 2),
        defaultValue: 1.5

    }
})

MainSettings.findOne({
    where: {
        id: 1
    }
}).then(settings => {
    if (settings == null) {
        MainSettings.create({})
    }
})

module.exports = MainSettings;