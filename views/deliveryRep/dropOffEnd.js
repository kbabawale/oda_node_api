const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Route = require("../../database/deliveryRep/route");

class DropOffEnd {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.mapStatus();
   }

   mapStatus() {
      const {
         userId,
         task_id,

      } = this.data;
      //authenticate rep
      User.findOne({
         where: {
            uid: userId,
            registerAs: 'DELIVERY REP'
         }
      }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         // To do: Check if user is delivery rep
         //fetch task
         Route.findAll({
            where: {
               task_id: task_id
            }
         }).then(routes => {
            if (routes.length == 0) {
               let responseData = JSON.stringify({
                  statusMsg: "Routes not found"
               });
               return ResponseObj.responseHandlers(
                  400,
                  this.res,
                  responseData
               );
            }
            routes.forEach((route, index) => {
               route.update({
                  status: "DROP OFF ENDED"
               })
               if (index == routes.length - 1) {
                  let responseData = JSON.stringify({
                     statusMsg: "Drop off ended"
                  });

                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               }
            })
         })
      });
   }
}

module.exports = DropOffEnd;