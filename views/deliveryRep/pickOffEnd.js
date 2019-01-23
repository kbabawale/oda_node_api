const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Route = require("../../database/deliveryRep/route");

class PickOffEnd {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.mapStatus();
   }

   mapStatus() {
      const { userId, task_id, store_id } = this.data;
      //authenticate rep
      User.findOne({ where: { uid: userId, registerAs: 'DELIVERY REP' } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         // To do: Check if user is a delivery rep
         //fetch task
         Route.findOne({
            where: { task_id: task_id, store_id: store_id }
         }).then(route => {
            if (route == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Route not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               //update status
               route
                  .update({
                     status: "PICK UP END"
                  })
                  .then(routeended => {
                     let responseData = JSON.stringify({
                        statusMsg: "Pick Up Ended",
                        route: routeended
                     });
                     return ResponseObj.responseHandlers(
                        200,
                        this.res,
                        responseData
                     );
                  });
            }
         });
      });
   }
}

module.exports = PickOffEnd;
