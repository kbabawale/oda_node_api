const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");
let OrderSummary = require("../../database/orders/orderSummary");
let User = require("../../database/authentication/users");
let Store = require("../../database/store/store");
let MatchDelivery = require("../../utilities/matchDeliveryRep");
let Task = require("../../database/deliveryRep/tasks");
let Notification = require("../../utilities/fcm");
let Product = require("../../database/products/storeProduct");

class AcceptOrder {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.acceptOrder();
   }

   acceptOrder() {
      const { userId, orderId } = this.data;
      User.findOne({ where: { uid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }

         Store.findOne({ where: { userUid: user.dataValues.uid } }).then(
            store => {
               if (store == null) {
                  let responseData = JSON.stringify({
                     statusMsg: "Store not found"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }

               OrderDetails.findOne({
                  where: {
                     uid: orderId,
                     storeUid: store.dataValues.uid,
                     status: "PENDING"
                  }
               }).then(order => {
                  if (order == null) {
                     let responseData = JSON.stringify({
                        statusMsg: "Order not found"
                     });
                     return ResponseObj.responseHandlers(
                        400,
                        this.res,
                        responseData
                     );
                  }
                  order.update({
                     status: "ACCEPTED"
                  });

                  // Reduce the Product in Store

                  Product.findOne({
                     where: { uid: order.dataValues.productUid }
                  }).then(storeProduct => {
                     storeProduct.update({
                        quantity:
                           storeProduct.dataValues.quantity -
                           order.dataValues.quantity
                     });
                  });

                  // Check if it's the last, then dispatch to Delivery Rep
                  OrderDetails.findAll({
                     where: { uid: order.dataValues.ordersummaryUid }
                  }).then(orderLists => {
                     const pendingOrders = orderLists.filter(ord => {
                        return ord.dataValues.status == "PENDING";
                     });

                     if (pendingOrders.length == 0) {
                        //Match Delivery REP
                        OrderSummary.findOne({
                           where: { uid: order.dataValues.ordersummaryUid }
                        }).then(summary => {
                           const deliveryRep = MatchDelivery(
                              summary.dataValues.destinationLatitude,
                              summary.dataValues.destinationLongitude
                           );
                           if (deliveryRep == null) {
                              // I don't know what to do
                           } else {
                              // Send notif to Delivery Rep
                              User.findOne({
                                 where: { uid: deliveryRep.dataValues.uid }
                              }).then(user => {
                                 if (user == null) {
                                    console.log(
                                       "Something is terribly wrong here"
                                    );
                                 }

                                 Task.create({
                                    deliveryRepUid: deliveryRep.dataValues.uid,
                                    orderUid: summary.dataValues.uid,
                                    status: "PENDING"
                                 }).then(task => {
                                    let notif = new Notification(
                                       user.dataValues.fcmtoken,
                                       "new_task",
                                       "New Task",
                                       "You have new tasks",
                                       "new_task"
                                    );
                                    notif.send();
                                 });
                              });
                           }
                        });
                     }
                  });

                  let responseData = JSON.stringify({
                     statusMsg: "Order accepted",
                     order: order
                  });
                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               });
            }
         );
      });
   }
}

module.exports = AcceptOrder;
