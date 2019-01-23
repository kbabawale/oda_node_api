const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");
let OrderSummary = require("../../database/orders/orderSummary");
let User = require("../../database/authentication/users");
let Store = require("../../database/store/store");
let NewMerchant = require("../../utilities/rematchProduct");
let Notification = require("../../utilities/fcm");

const DECLINETHRESHOLD = 3;

class DeclineOrder {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.declineOrder();
   }

   declineOrder() {
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
                  where: { uid: orderId, storeUid: store.dataValues.uid }
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
                  order
                     .update({
                        status: "DECLINED",
                        declineNumber: order.dataValues.declineNumber + 1
                     })
                     .then(order => {
                        if (order.dataValues.declineNumber < DECLINETHRESHOLD) {
                           let newLoad = NewMerchant(
                              order.dataValues.productUid,
                              order.dataValues.storeUid
                           );
                           if (newLoad == null) {
                              // No store having the product was found
                              // Notify Buyer and return buyer's money for this product
                              OrderSummary.findOne({
                                 where: {
                                    uid: order.dataValues.ordersummaryUid
                                 }
                              }).then(orderSummary => {
                                 if (orderSummary == null) {
                                    console.log("Better wahala dey"); // I pray it never enters here
                                 } else {
                                    User.findOne({
                                       where: {
                                          uid: orderSummary.dataValues.buyerUid
                                       }
                                    }).then(user => {
                                       if (user == null) {
                                          console.log("I'm dead!");
                                       } else {
                                          // Please return user's money here then send notification
                                          // Oops, no wallet system yet
                                          let notif = new Notification(
                                             user.fcmtoken,
                                             "product_unavailable",
                                             "Product Unavailable",
                                             "This product is unavailable, your account have been credited",
                                             "product_unavailable",
                                             order.dataValues.productUid
                                          );
                                          notif.send();
                                       }
                                    });
                                 }
                              });
                           } else {
                              // Create new order and notify merchant
                              OrderDetails.create({
                                 productTitle: newLoad.product.dataValues.title,
                                 price: newLoad.product.dataValues.price,
                                 storeName: newLoad.store.dataValues.name,
                                 status: "PENDING",
                                 quantity: order.dataValues.quantity,
                                 unitOfMeasure: order.dataValues.unitOfMeasure,
                                 productUid: newLoad.product.dataValues.uid,
                                 storeUid: newLoad.store.dataValues.uid,
                                 ordersummaryUid:
                                    order.dataValues.ordersummaryUid
                              }).then(newOrder => {
                                 // Get Merchant details and notify him
                                 User.findOne({
                                    where: { uid: newLoad.store.userUid }
                                 }).then(user => {
                                    if (user == null) {
                                       console.log("Wahala dey oh");
                                    }
                                    let notif = new Notification(
                                       user.defaultValues.fcmtoken,
                                       "new_order",
                                       "New Order",
                                       "You have new orders",
                                       "new_order"
                                    );

                                    notif.send();
                                 });
                              });
                           }
                        } else {
                           // Notify Buyer
                        }
                     });

                  let responseData = JSON.stringify({
                     statusMsg: "Order declined",
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

module.exports = DeclineOrder;
