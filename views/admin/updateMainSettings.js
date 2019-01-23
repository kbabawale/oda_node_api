const ResponseObj = require("../../utilities/responsehandler");
let MainSettings = require("../../database/admin/mainSettings");

class Settings {
    constructor(data, res) {
        this.data = data.body;
        this.res = res;
        this.changeSettings();
    }
    changeSettings() {
        const {
            txPercentage,
            maximum,
            minimum,
            bufferPercentage
        } = this.data;

        MainSettings.findOne({
            where: {
                id: 1
            }
        }).then(settings => {
            if (settings == null) {
                MainSettings.create({
                    TxPercentage: (parseFloat(txPercentage) / 100) + 1,
                    maximum: maximum,
                    minimum: minimum,
                    bufferPercentage: (parseFloat(bufferPercentage) / 100) + 1
                }).then(settings => {
                    let responseData = JSON.stringify({
                        statusMsg: "Settings Created",
                        settings
                    });
                    return ResponseObj.responseHandlers(200, this.res, responseData);
                })

            } else {
                settings.update({
                    TxPercentage: (parseFloat(txPercentage) / 100) + 1,
                    maximum: maximum,
                    minimum: minimum,
                    bufferPercentage: (parseFloat(bufferPercentage) / 100) + 1
                }).then(settings => {
                    let responseData = JSON.stringify({
                        statusMsg: "Settings Updated",
                        settings
                    });
                    return ResponseObj.responseHandlers(200, this.res, responseData);
                })

            }
        })
    }
}

module.exports = Settings;