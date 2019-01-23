const ResponseObj = require("../../utilities/responsehandler");
let Product = require("../../database/products/storeProduct");
let GenericProduct = require("../../database/products/genericProduct");

class UpdateProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.update();
   }
   validateData() {
      return {
         state: true
      };
   }
   update() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            productId,
            storeId,
            price,
            displayPrice,
            quantity
         } = this.data;
         Product.findOne({
            where: {
               uid: productId,
               storeUid: storeId
            }
         }).then(
            product => {
               if (product == null) {
                  let responseData = JSON.stringify({
                     statusMsg: "This product is not found."
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }
               product.update({
                  price: price,
                  displayPrice: displayPrice,
                  quantity: quantity
               });
               //speculation
               GenericProduct.findOne({
                  where: {
                     uid: product.dataValues.genericproductUid
                  }
               }).then(genericProduct => {
                  let responseData = JSON.stringify({
                     statusMsg: "Product uploaded",
                     details: genericProduct,
                     product: product,

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
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = UpdateProduct;

//