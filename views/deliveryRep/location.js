const ResponseObj = require("../../utilities/responsehandler");
let Location = require("../../database/deliveryRep/location");

class UpdateLocation {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.updateLocation();
   }

   updateLocation() {
      const { userId, latitude, longitude } = this.data;
      Location.findOne({ where: { deliveryRepUid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User is not delivery rep"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         let repLocation = {
            type: "Point",
            coordinates: [longitude, latitude]
         };
         user.update({ location: repLocation });
         let responseData = JSON.stringify({
            statusMsg: "Location updated"
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = UpdateLocation;

//
