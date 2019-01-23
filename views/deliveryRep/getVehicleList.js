const ResponseObj = require("../../utilities/responsehandler");
let Vehicle = require("../../database/deliveryRep/vehicleList");

class GetAllVehicles {
   constructor(data, res) {
      this.res = res;
      this.getAllVehicles();
   }
   getAllVehicles() {
      Vehicle.findAll({}).then(vehiclelist => {
         let responseData = JSON.stringify({
            statusMsg: "Vehicle List",
            vehicles: vehiclelist
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = GetAllVehicles;