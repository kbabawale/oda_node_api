const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Route = require("../../database/deliveryRep/route");

class GetRoutes {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getRoutes();
   }

   getRoutes() {
      const {
         userId,
         task_id
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
         // Check if user is a delivery rep
         //fetch task
         Route.findAll({
            where: {
               task_id: task_id
            }
         }).then(route => {
            if (route.length == 0) {
               let responseData = JSON.stringify({
                  statusMsg: "Route not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               let responseData = JSON.stringify({
                  statusMsg: "Route Found",
                  route: route
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            }
         });
      });
   }
}

module.exports = GetRoutes;