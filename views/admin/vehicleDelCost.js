const ResponseObj = require("../../utilities/responsehandler");
let FareSettings = require("../../database/admin/fareSettngs");
let Vehicle = require("../../database/deliveryRep/vehicleList")

class DeliveryCost {
    constructor(data, res) {
        this.data = data.body;
        this.res = res;
        this.createDeliveryCost();
    }

    createDeliveryCost() {
        const {
            vehicleId,
            baseFare,
            perKm,
            perMin
        } = this.data;
        Vehicle.findOne({
            where: {
                id: vehicleId
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
                    vehicleId: vehicleId
                }
            }).then(settings => {
                if (settings == null) {
                    FareSettings.create({
                        vehicleId,
                        baseFare,
                        perKm,
                        perMin
                    }).then(settings => {
                        let responseData = JSON.stringify({
                            statusMsg: "Vehicle settings created",
                            settings
                        });
                        return ResponseObj.responseHandlers(200, this.res, responseData);
                    })

                }
                settings.update({
                    baseFare,
                    perKm,
                    perMin
                }).then(settings => {
                    let responseData = JSON.stringify({
                        statusMsg: "Vehicle settings updated",
                        settings
                    });
                    return ResponseObj.responseHandlers(200, this.res, responseData);

                })


            })

        })
    }
}

module.exports = DeliveryCost;