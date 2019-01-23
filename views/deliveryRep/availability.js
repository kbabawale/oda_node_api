const ResponseObj = require("../../utilities/responsehandler");
let Location = require("../../database/deliveryRep/location");

class Available {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.toggleAvailability();
   }

   toggleAvailability() {
      const { userId, available } = this.data;
      Location.findOne({ where: { deliveryRepUid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User is not delivery rep"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         if (available == 0) {
            user.update({
               available: false
            });
            let responseData = JSON.stringify({
               statusMsg: "Not Available"
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         }

         if (available == 1) {
            user.update({
               available: true
            });
            let responseData = JSON.stringify({
               statusMsg: "Available"
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         }

         let responseData = JSON.stringify({
            statusMsg: "Available value is not valid"
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      });
   }
}

module.exports = Available;
