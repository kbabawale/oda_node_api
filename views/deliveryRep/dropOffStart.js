const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Route = require("../../database/deliveryRep/route");
let Task = require("../../database/deliveryRep/tasks");
let OrderSummary = require("../../database/orders/orderSummary");
let Notification = require("../../utilities/fcm");

class DropOffStart {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.mapStatus();
   }

   mapStatus() {
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
         // Todo: Check if user is a delivery rep
         //fetch task
         Route.findAll({
            where: {
               task_id: task_id
            }
         }).then(
            routes => {
               if (routes.length == 0) {
                  let responseData = JSON.stringify({
                     statusMsg: "Routes not found"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               } else {
                  routes.forEach((route, index) => {
                     route.update({
                        status: "DROP OFF STARTED"
                     })
                     if (index == routes.length - 1) {
                        Task.findOne({
                           where: {
                              uid: task_id
                           }
                        }).then(task => {
                           OrderSummary.findOne({
                              where: {
                                 uid: task.dataValues.orderUid
                              }
                           }).then(ordersummary => {

                              User.findOne({
                                 where: {
                                    uid: ordersummary.dataValues.buyerUid
                                 }
                              }).then(user => {
                                 let notif = new Notification(
                                    user.dataValues.fcmtoken,
                                    "drop_off_started",
                                    "Delivery is coming",
                                    "Drop off started",
                                    "drop_off_started"
                                 );
                                 notif.send();


                                 let responseData = JSON.stringify({
                                    statusMsg: "Drop off started"
                                 });

                                 return ResponseObj.responseHandlers(
                                    200,
                                    this.res,
                                    responseData
                                 );

                              })
                           })
                        })

                     }
                  })

               }
            }
         );
      });
   }
}

module.exports = DropOffStart;