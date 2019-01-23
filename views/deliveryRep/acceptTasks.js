const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");
let User = require("../../database/authentication/users");
let Store = require("../../database/store/store");
let Task = require("../../database/deliveryRep/tasks");
let Notification = require("../../utilities/fcm");
let Route = require("../../database/deliveryRep/route");

class AcceptTask {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.acceptTask();
   }

   acceptTask() {
      var storeSet = [];
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

         //fetch task
         Task.findOne({
            where: {
               uid: task_id,
               status: "PENDING"
            }
         }).then(task => {
            if (task == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Task does not exist or already accepted"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               //update status
               task
                  .update({
                     deliveryRepUid: user.dataValues.uid,
                     status: "ACCEPTED"
                  })
                  .then(taskaccepted => {
                     //send notification to all merchants from this order

                     //fetch the merchants
                     OrderDetails.findAll({
                        where: {
                           ordersummaryUid: task.dataValues.orderUid
                        }
                     }).then(orderFound => {
                        if (orderFound.length == 0) {
                           let responseData = JSON.stringify({
                              statusMsg: "No Order Details found for this task"
                           });
                           return ResponseObj.responseHandlers(
                              400,
                              this.res,
                              responseData
                           );
                        } else {
                           //fetch store details for each order item
                           //could be one or more items
                           orderFound.forEach((value, index) => {
                              //first add route for rep
                              Route.create({
                                 store_id: value.dataValues.storeUid,
                                 task_id: task.dataValues.uid,
                                 status: "PENDING"
                              });

                              //streamline array to avoid duplicate sending of notification to same merchant
                              if (storeSet.includes(value.dataValues.storeUid) == false) {
                                 storeSet.push(value.dataValues.storeUid);
                              }

                           });

                           //use store ids to fetch user ids of merchants
                           storeSet.forEach((value, index) => {
                              console.log(value)
                              Store.findOne({
                                 where: {
                                    uid: value
                                 }
                              }).then(
                                 storeowner => {
                                    if (storeowner == null) {
                                       let responseData = JSON.stringify({
                                          statusMsg: "No Store Owner Found"
                                       });
                                       return ResponseObj.responseHandlers(
                                          400,
                                          this.res,
                                          responseData
                                       );
                                    } else {
                                       //fetch user details, and send notification to them
                                       User.findOne({
                                          where: {
                                             uid: storeowner.dataValues.userUid
                                          }
                                       }).then(userfound => {
                                          //fcm
                                          let notif = new Notification(
                                             userfound.dataValues.fcmtoken,
                                             "new_task",
                                             "Task Accepted by Delivery Rep",
                                             "Task Accepted",
                                             "new_task"
                                          );
                                          notif.send();

                                          if (index == storeSet.length - 1) {
                                             let responseData = JSON.stringify({
                                                statusMsg: "Task Accepted",
                                                task: task
                                             });

                                             return ResponseObj.responseHandlers(
                                                200,
                                                this.res,
                                                responseData
                                             );
                                          }
                                       });
                                    }
                                 }
                              );
                           });
                        }
                     });
                  });
            }
         });
      });
   }
}

module.exports = AcceptTask;