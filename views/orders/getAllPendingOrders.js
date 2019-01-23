const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");
let Store = require("../../database/store/store");
let User = require("../../database/authentication/users");

class GetAllPendingOrders {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getAllPendingOrders();
   }

   getAllPendingOrders() {
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
                        statusMsg: "Store not found"
                     });
                     return ResponseObj.responseHandlers(
                        400,
                        this.res,
                        responseData
                     );
                  }
                  OrderDetails.findAll({
                     where: {
                        status: "PENDING",
                        storeUid: store.dataValues.uid
                     }
                  }).then(orders => {
                     let responseData = JSON.stringify({
                        statusMsg: "All Pending Orders",
                        pendingOrders: orders
                     });
                     return ResponseObj.responseHandlers(
                        200,
                        this.res,
                        responseData
                     );
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

module.exports = GetAllPendingOrders;
