const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Task = require("../../database/deliveryRep/tasks");
let Order = require("../../database/orders/orderSummary");
let OrderDetails = require("../../database/orders/orderDetails");

class GetPendingTasks {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getPendingTasks();
   }

   getPendingTasks() {
      const { userId } = this.data;
      //authenticate rep
      User.findOne({ where: { uid: userId, registerAs: 'DELIVERY REP' } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         //To do Check if user is a delivery rep
         //fetch task
         Task.findAll({
            where: { deliveryRepUid: userId, status: "PENDING" }
         }).then(taskdetails => {
            if (taskdetails.length == 0) {
               let responseData = JSON.stringify({
                  statusMsg: "Task not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               //fetch order details
               Order.findOne({ where: { uid: task.dataValues.orderUid } }).then(
                  ordersummary => {
                     if (ordersummary == null) {
                        let responseData = JSON.stringify({
                           statusMsg: "Order Summary not found"
                        });
                        return ResponseObj.responseHandlers(
                           400,
                           this.res,
                           responseData
                        );
                     }

                     //fetch order items for each order
                     OrderDetails.findAll({
                        where: { ordersummaryUid: ask.dataValues.orderUid }
                     }).then(orderdetails => {
                        if (orderdetails.length == 0) {
                           let responseData = JSON.stringify({
                              statusMsg: "Order Details not found"
                           });
                           return ResponseObj.responseHandlers(
                              400,
                              this.res,
                              responseData
                           );
                        }
                        let responseData = JSON.stringify({
                           statusMsg: "Tasks Found",
                           tasks: taskdetails,
                           orders: ordersummary,
                           orderdetails: orderdetails
                        });
                        return ResponseObj.responseHandlers(
                           200,
                           this.res,
                           responseData
                        );
                     });
                  }
               );
            }
         });
      });
   }
}

module.exports = GetPendingTasks;
