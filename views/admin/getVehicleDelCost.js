const ResponseObj = require("../../utilities/responsehandler");
let FareSettings = require("../../database/admin/fareSettngs");
let Vehicle = require("../../database/deliveryRep/vehicleList")


class GetVehicleCost {
    constructor(data, res) {
        this.vehicleId = data.query.vehicleId;
        this.res = res;
        this.getVehicleCost()
    }
    getVehicleCost() {
        Vehicle.findOne({
            where: {
                id: this.vehicleId
            }
        }).then(vehicle => {
            if (vehicle == null) {
                let responseData = JSON.stringify({
                    statusMsg: "This vehicle is not found",
                });
                return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            FareSettings.findOne({
                where: {
                    vehicleId: vehicle.dataValues.id
                }
            }).then(settings => {
                if (settings == null) {
                    let responseData = JSON.stringify({
                        statusMsg: "No Settings for this Vehicle",
                    });
                    return ResponseObj.responseHandlers(400, this.res, responseData);
                }
                let responseData = JSON.stringify({
                    statusMsg: "Vehicle Settings",
                    settings
                });
                return ResponseObj.responseHandlers(400, this.res, responseData);
            })
        })
    }
}

module.exports = GetVehicleCost;