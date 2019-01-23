const ResponseObj = require("../../utilities/responsehandler");
let Store = require("../../database/store/store");
let NewProduct = require("../../database/products/storeProduct");
let GenericProduct = require("../../database/products/genericProduct");
let validator = require("validator");

class Product {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createProduct();
   }

   validate() {
      const {
         storeId,
         genericUid,
         price,
         displayPrice,
         quantity
      } = this.data;
      if (storeId == undefined || validator.isEmpty(storeId)) {
         return {
            state: false,
            errorMsg: "Store ID is required"
         };
      }

      if (genericUid == undefined || validator.isEmpty(storeId)) {
         return {
            state: false,
            errorMsg: "Generic Product ID is required"
         };
      }

      if (
         price == undefined ||
         validator.isEmpty(price) ||
         validator.isDecimal(price) == false
      ) {
         return {
            state: false,
            errorMsg: "Price is required, in 2 decimal places"
         };
      }

      if (
         displayPrice == undefined ||
         validator.isEmpty(displayPrice) ||
         validator.isDecimal(displayPrice) == false
      ) {
         return {
            state: false,
            errorMsg: "Display price is required, in 2 decimal places"
         };
      }

      if (
         quantity == undefined ||
         validator.isEmpty(quantity) ||
         validator.isInt(quantity) == false ||
         quantity < 1
      ) {
         return {
            state: false,
            errorMsg: "Quantity must be a whole number"
         };
      }

      return {
         state: true
      };
   }

   createProduct() {
      const {
         userId,
         storeId,
         genericProductId,
         price,
         displayPrice,
         quantity
      } = this.data;

      Store.findOne({
         where: {
            uid: storeId,
            userUid: userId
         }
      }).then(
         store => {
            if (store == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Store not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            GenericProduct.findOne({
               where: {
                  uid: genericProductId
               }
            }).then(
               genericProduct => {
                  if (genericProduct == null) {
                     let responseData = JSON.stringify({
                        statusMsg: "Generic Product not found"
                     });
                     return ResponseObj.responseHandlers(
                        400,
                        this.res,
                        responseData
                     );
                  }
                  // Create Product
                  NewProduct.create({
                     storeUid: store.dataValues.uid,
                     price: price,
                     displayPrice: displayPrice,
                     genericproductUid: genericProductId,
                     quantity: quantity,
                     location: store.dataValues.location
                  }).then(product => {
                     let responseData = JSON.stringify({
                        statusMsg: "Product Created",
                        details: genericProduct,
                        product: product
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
      );
   }
}

module.exports = Product;