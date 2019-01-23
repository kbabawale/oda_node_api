const ResponseObj = require("../../utilities/responsehandler");
let OrderSummary = require("../../database/orders/orderSummary");
let OrderDetails = require("../../database/orders/orderDetails");
let Store = require("../../database/store/store");
let Product = require("../../database/products/storeProduct");

class CancelOrder {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.cancelOrder();
   }
   cancelOrder() {
      const { orderId, userId } = this.data;
      OrderSummary.findOne({ where: { uid: orderId, buyerUid: userId } }).then(
         ordersummary => {
            if (ordersummary == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Order not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               OrderDetails.findAll({
                  where: { ordersummaryUid: ordersummary.dataValues.uid }
               }).then(orderdetails => {
                  orderdetails.forEach(orderdetail => {
                     if (orderdetail.dataValues.status !== "CANCELED") {
                        orderdetail.update({
                           status: "CANCELED"
                        });
                        /*
                        Product.findOne({
                           where: { uid: orderdetail.productUid }
                        }).then(product => {
                           product.update({
                              quantity: product.dataValues.quantity + 1
                           });
                        });
                        */
                     }
                  });
                  ordersummary.update({
                     status: "CANCELED" //canceled
                  });
                  let responseData = JSON.stringify({
                     statusMsg: "Order canceled",
                     order: ordersummary
                  });
                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               });
            }
         }
      );
   }
}

module.exports = CancelOrder;
