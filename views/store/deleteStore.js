const ResponseObj = require("../../utilities/responsehandler");
let Store = require("../../database/store/store");
let Product = require("../../database/products/storeProduct");

const toggleString = {
   "0": "deleted",
   "1": "activated"
};

class DeleteStore {
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
         const { storeId, toggle } = this.data;
         Store.findOne({ where: { uid: storeId } }).then(store => {
            if (store == null) {
               let responseData = JSON.stringify({
                  statusMsg: "This store is not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            // If toggle = 1, activate store
            if (toggle == "1") {
               store.update({
                  deleted: false
               });
            }
            // if toggle = 0, delete store
            if (toggle == "0") {
               store.update({
                  deleted: true
               });
            }

            Product.findAll({ where: { storeUid: storeId } }).then(products => {
               if (products.length == 0) {
                  let responseData = JSON.stringify({
                     statusMsg: `Store ${toggleString[toggle]}. ${
                        products.length
                     } products ${toggleString[toggle]} alongside.`
                  });
                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               }
               products.forEach(product => {
                  if (toggle == "1") {
                     product.update({
                        deleted: false
                     });
                  }
                  if (toggle == "0") {
                     product.update({
                        deleted: true
                     });
                  }
               });
               let responseData = JSON.stringify({
                  statusMsg: `Store ${toggleString[toggle]}. ${
                     products.length
                  } products ${toggleString[toggle]} alongside.`
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            });
         });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validate.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = DeleteStore;
