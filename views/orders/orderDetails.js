const ResponseObj = require("../../utilities/responsehandler");
let OrderDetails = require("../../database/orders/orderDetails");

class Order {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getDetails();
   }
   getDetails() {
      const { orderId } = this.data;
      OrderDetails.findOne({ where: { uid: orderId } }).then(order => {
         if (order == null) {
            let responseData = JSON.stringify({
               statusMsg: "Order not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         let responseData = JSON.stringify({
            statusMsg: "Order accepted",
            order: order
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = Order;
