const ResponseObj = require("../../utilities/responsehandler");
let Vehicle = require("../../database/deliveryRep/vehicleList");

class DeleteVehicle {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doDelete();
   }

   validateData() {
      return {
         state: true
      };
   }

   doDelete() {
      let validate = this.validateData();
      if (validate.state) {
         const { id } = this.data;
         
         Vehicle.destroy({ where: { id: id } });
            
            Vehicle.findOne({where: {id : id}}).then(found => {
                if(found == null){
                    let responseData = JSON.stringify({
                        statusMsg: "Vehicle Deleted."
                     });
                     return ResponseObj.responseHandlers(200, this.res, responseData);
                }else{
                    let responseData = JSON.stringify({
                        statusMsg: "Couldnt Delete Vehicle."
                     });
                     return ResponseObj.responseHandlers(400, this.res, responseData);
                }
            });
               
            
         
      } else {
         let responseData = JSON.stringify({
            statusMsg: validate.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = DeleteVehicle;
