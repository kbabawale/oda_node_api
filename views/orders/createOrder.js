const ResponseObj = require("../../utilities/responsehandler");
let OrderSummary = require("../../database/orders/orderSummary");
let OrderDetails = require("../../database/orders/orderDetails");
let Task = require("../../database/deliveryRep/tasks");
let Store = require("../../database/store/store");
let Product = require("../../database/products/storeProduct");
let User = require("../../database/authentication/users");
let GenericProduct = require("../../database/products/genericProduct");
let Notification = require("../../utilities/fcm");

//

class CreateOrder {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createOrder();
   }

   validateData() {
      return {
         state: true
      };
   }

   createOrder() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            buyerId, //this is the User ID, not store ID
            products,
            destinationLatitude,
            destinationLongitude,
            totalCost
         } = this.data;

         User.findOne({
            where: {
               uid: buyerId
            }
         }).then(user => {
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "User not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               OrderSummary.create({
                  productsCost: totalCost,
                  deliveryCost: 0,
                  totalCost: totalCost,
                  status: "PLACED",
                  destinationLatitude: destinationLatitude,
                  destinationLongitude: destinationLongitude,
                  numberOfProducts: products.length,
                  buyerUid: buyerId
               }).then(ordersummary => {
                  products.forEach((product, index) => {
                     Product.findOne({
                        where: {
                           uid: product.productId
                        }
                     }).then(storeproduct => {
                        // This is not supposed to happen
                        if (storeproduct == null) {
                           let responseData = JSON.stringify({
                              statusMsg: "Product not found"
                           });
                           return ResponseObj.responseHandlers(
                              400,
                              this.res,
                              responseData
                           );
                        }
                        Store.findOne({
                           where: {
                              uid: storeproduct.dataValues.storeUid
                           }
                        }).then(store => {
                           GenericProduct.findOne({
                              where: {
                                 uid: storeproduct.dataValues.genericproductUid
                              }
                           }).then(genericProduct => {
                              OrderDetails.create({
                                 ordersummaryUid: ordersummary.dataValues.uid,
                                 productUid: storeproduct.dataValues.uid,
                                 productTitle: genericProduct.dataValues.title,
                                 storeUid: store.dataValues.uid,
                                 price: storeproduct.dataValues.price,
                                 storeName: store.dataValues.name,
                                 status: "PENDING",
                                 quantity: product.quantity
                              }).then(orderdetails => {
                                 // Notify Seller
                                 User.findOne({
                                    where: {
                                       uid: store.dataValues.userUid
                                    }
                                 }).then(user => {
                                    let notif = new Notification(
                                       user.dataValues.fcmtoken,
                                       "new_order",
                                       "New Order",
                                       "You have new orders",
                                       "new_order"
                                    );
                                    notif.send();
                                    if (index == products.length - 1) {
                                       Task.create({
                                          orderUid: ordersummary.dataValues.uid
                                       })
                                       let responseData = JSON.stringify({
                                          statusMsg: "Order placed",
                                          order: ordersummary
                                       });

                                       return ResponseObj.responseHandlers(
                                          200,
                                          this.res,
                                          responseData
                                       );
                                    }

                                 });
                              });
                           });
                        });
                     });


                  });
               });
            }
         });
      }
   }
}

module.exports = CreateOrder;