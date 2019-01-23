const ResponseObj = require("../../utilities/responsehandler");
let Store = require("../../database/store/store");
let User = require("../../database/authentication/users");
let Product = require("../../database/products/storeProduct");
let GenericProduct = require("../../database/products/genericProduct");

class StoreDetails {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getStore();
   }

   getStore() {
      const {
         storeId
      } = this.data;
      Store.findOne({
         where: {
            uid: storeId
         }
      }).then(store => {
         if (store == null) {
            let responseData = JSON.stringify({
               statusMsg: "This store is not found."
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }

         User.findOne({
            where: {
               uid: store.userUid
            }
         }).then(user => {
            if (user == null) {
               // if it enters this block, then a strange thing is happening
               let responseData = JSON.stringify({
                  statusMsg: "User is not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            Product.findAll({
               where: {
                  storeUid: store.dataValues.uid
               }
            }).then(
               products => {
                  let compositeProduct = [];
                  let promiseTracker = 0;

                  products.forEach((product, index) => {
                     GenericProduct.findOne({
                        where: {
                           uid: product.dataValues.genericproductUid
                        }
                     }).then(generic => {
                        promiseTracker++;
                        product.dataValues.details = generic;
                        compositeProduct.push(product);
                        if (promiseTracker == products.length) {
                           delete user.dataValues.password;
                           let responseData = JSON.stringify({
                              statusMsg: "Store Details",
                              store: store,
                              owner: user,
                              products: compositeProduct
                           });
                           return ResponseObj.responseHandlers(
                              200,
                              this.res,
                              responseData
                           );

                        }
                     })
                  })


               }
            );
         });
      });
   }
}

module.exports = StoreDetails;