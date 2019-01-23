const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Store = require("../../database/store/store");
let Route = require("../../database/deliveryRep/route");
let Notification = require("../../utilities/fcm");

class PickOffStart {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.mapStatus();
   }

   mapStatus() {
      const {
         userId,
         task_id,
         store_id
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

         //fetch route
         Route.findOne({
            where: {
               task_id: task_id,
               store_id: store_id
            }
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
                     status: "PICK UP START"
                  })
                  .then(routestarted => {
                     //send notification to owner of store
                     Store.findOne({
                        where: {
                           userUid: userId
                        }
                     }).then(
                        storeowner => {
                           if (storeowner == null) {
                              let responseData = JSON.stringify({
                                 statusMsg: "Store Owner not found"
                              });
                              return ResponseObj.responseHandlers(
                                 400,
                                 this.res,
                                 responseData
                              );
                           }
                           let notif = new Notification(
                              userfound.dataValues.fcmtoken,
                              "Route Started",
                              "Delivery Rep is en route for pick up",
                              "Route Started",
                              "new_route"
                           );
                           notif.send();
                        }
                     );
                     let responseData = JSON.stringify({
                        statusMsg: "Pick Up Started",
                        route: routestarted
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

module.exports = PickOffStart;