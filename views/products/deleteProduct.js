const ResponseObj = require("../../utilities/responsehandler");

let Product = require("../../database/products/storeProduct");

const toggleString = {
   "0": "deleted",
   "1": "activated"
};

class DeleteProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doDelete();
   }

   validateData() {
      const { toggle } = this.data;
      if (Object.keys(toggleString).includes(toggle) == false) {
         return {
            state: false,
            errorMsg: "Invalid toggle flag"
         };
      }
      return {
         state: true
      };
   }

   doDelete() {
      let validate = this.validateData();
      if (validate.state) {
         const { productId, toggle } = this.data;
         Product.findOne({ where: { uid: productId } }).then(product => {
            if (product == null) {
               let responseData = JSON.stringify({
                  statusMsg: "This product is not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            let status;
            // If toggle = 1, activate product
            if (toggle == "1") {
               product.update({
                  deleted: false
               });
               status = "activated";
            }
            // if toggle = 0, delete store
            if (toggle == "0") {
               product.update({
                  deleted: true
               });
               status = "deleted";
            }

            let responseData = JSON.stringify({
               statusMsg: "Product " + status
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validate.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = DeleteProduct;
