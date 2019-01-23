const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");
let OrderSummaries = require("../../database/orders/orderSummary");
let Store = require("../../database/store/store");
let User = require("../../database/authentication/users");

class AllOrders {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getAllOrders();
   }
   getAllOrders() {
      const { userId } = this.data;

      User.findOne({ where: { uid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }

         if (user.dataValues.registerAs == "MERCHANT") {
            Store.findOne({ where: { userUid: user.dataValues.uid } }).then(
               store => {
                  if (store == null) {
                     let responseData = JSON.stringify({
                        statusMsg: "Store is not found"
                     });
                     return ResponseObj.responseHandlers(
                        400,
                        this.res,
                        responseData
                     );
                  }

                  OrderDetails.findAll({
                     where: { storeUid: store.dataValues.uid }
                  }).then(orderdetails => {
                     OrderSummaries.findAll({
                        where: { buyerUid: user.dataValues.uid }
                     }).then(ordersummaries => {
                        let responseData = JSON.stringify({
                           statusMsg: "All Orders",
                           orderRequests: orderdetails,
                           ordersPlaced: ordersummaries
                        });
                        return ResponseObj.responseHandlers(
                           200,
                           this.res,
                           responseData
                        );
                     });
                  });
               }
            );
         } else {
            let responseData = JSON.stringify({
               statusMsg: "User is not MERCHANT"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
      });
   }
}

module.exports = AllOrders;
