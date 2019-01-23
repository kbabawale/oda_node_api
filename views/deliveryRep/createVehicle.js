const ResponseObj = require("../../utilities/responsehandler");
let Vehicle = require("../../database/deliveryRep/vehicleList");

class CreateVehicle {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createVehicle();
   }
   validateData() {
      return {
         state: true,
         errorMsg: ""
      };
   }
   createVehicle() {
      let validated = this.validateData();
      if (validated.state) {
         const { vehicleName } = this.data;
         console.log(vehicleName);
         Vehicle.create({
            vehicle: vehicleName
         })
            .then(vehicle => {
               let responseData = JSON.stringify({
                  statusMsg: "Vehicle successfully created",
                  vehicle: vehicle
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            })
            .catch(err => {
               let responseData = JSON.stringify({
                  statusMsg: "Something wrong happened"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = CreateVehicle;
