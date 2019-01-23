const ResponseObj = require("../../utilities/responsehandler");
let NewBrandProduct = require("../../database/products/brandProduct");

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
         NewBrandProduct.findOne({ where: { uid: id } }).then(found => {
            if (found == null) {
               let responseData = JSON.stringify({
                  statusMsg: "No Brand Product Found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               let responseData = JSON.stringify({
                  statusMsg: "No Brand Products Found",
                  product: found
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            }
         });
      } else {
         //else get all of them
         NewBrandProduct.findAll({}).then(newfound => {
            if (newfound.length == 0) {
               let responseData = JSON.stringify({
                  statusMsg: "No Brand Products Found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            let responseData = JSON.stringify({
               statusMsg: "Brand Products",
               products: newfound
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         });
      }
   }
}

module.exports = GetProducts;
