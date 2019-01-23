const ResponseObj = require("../../utilities/responsehandler");
let NewGenericProduct = require("../../database/products/genericProduct");

class GetProducts {
   constructor(req, res) {
      this.data = req.body;
      this.res = res;
      this.getAllCategories();
   }

   getAllCategories() {
      const { id } = this.data;

      //if id provided, get its' details
      if (id != "") {
         NewGenericProduct.findOne({ where: { uid: id } }).then(found => {
            if (!found) {
               let responseData = JSON.stringify({
                  statusMsg: "No Generic Product Found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               let responseData = JSON.stringify({
                  statusMsg: "Generic Product",
                  product: found
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            }
         });
      } else {
         //else get all of them
         NewGenericProduct.findAll({}).then(found => {
            if (found.length != 0) {
               let responseData = JSON.stringify({
                  statusMsg: "Generic Products",
                  products: found
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            } else {
               let responseData = JSON.stringify({
                  statusMsg: "No Generic Products Found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
         });
      }
   }
}

module.exports = GetProducts;
