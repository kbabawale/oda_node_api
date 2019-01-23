const ResponseObj = require("../../utilities/responsehandler");
let Product = require("../../database/products/storeProduct");
let Store = require("../../database/store/store");
let User = require("../../database/authentication/users");
let GenericProduct = require("../../database/products/genericProduct");

class GetProduct {
   constructor(req, res) {
      this.productId = req.query.productId;
      this.res = res;
      this.getProductDetails();
   }

   getProductDetails() {
      Product.findOne({
         where: {
            uid: this.productId
         }
      }).then(product => {
         if (product == null) {
            let responseData = JSON.stringify({
               statusMsg: "Product not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }

         Store.findOne({
            where: {
               uid: product.dataValues.storeUid
            }
         }).then(
            store => {
               User.findOne({
                  where: {
                     uid: store.dataValues.userUid
                  }
               }).then(
                  user => {
                     GenericProduct.findOne({
                        where: {
                           uid: product.dataValues.genericproductUid
                        }
                     }).then(genericproduct => {
                        delete user.dataValues.password;
                        let responseData = JSON.stringify({
                           statusMsg: "Product Found",
                           details: genericproduct,
                           product: product,
                           store: store,
                           user: user
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
      });
   }
}

module.exports = GetProduct;

//