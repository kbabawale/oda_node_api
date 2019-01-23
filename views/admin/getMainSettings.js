const ResponseObj = require("../../utilities/responsehandler");
let MainSettings = require("../../database/admin/mainSettings");


class GetSettings {
    constructor(data, res) {
        this.res = res;
        this.getMainSettings()
    }
    getMainSettings() {
        MainSettings.findOne({
            where: {
                id: 1
            }
        }).then(settings => {
            let responseData = JSON.stringify({
                statusMsg: "Main Settings",
                settings: settings
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
        })
    }
}

module.exports = GetSettings;