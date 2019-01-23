let Sequelize = require("sequelize");
const ResponseObj = require("../../utilities/responsehandler");
let GenericProduct = require("../../database/products/genericProduct");
let Product = require("../../database/products/storeProduct");

class GetProduct {
   constructor(data, res) {
      this.longitude = data.query.longitude;
      this.latitude = data.query.latitude;
      this.genericId = data.query.genericId;
      this.res = res;
      this.getProduct();
   }

   getProduct() {
      GenericProduct.findOne({
         where: {
            uid: this.genericId
         }
      }).then(
         genericProduct => {
            if (genericProduct == null) {
               let responseData = JSON.stringify({
                  statusMsg: "No Generic Product with this ID found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            Product.findAll({
               where: Sequelize.where(
                  Sequelize.fn(
                     "ST_DWithin",
                     Sequelize.col("location"),
                     Sequelize.fn(
                        "ST_MakePoint",
                        this.longitude,
                        this.latitude
                     ),
                     0.064 // Approx. 4 km radius
                  ),
                  true
               ),

               order: [
                  ["location", "ASC"]
               ],
               limit: 1
            }).then(product => {
               if (product.length == 0) {
                  let responseData = JSON.stringify({
                     statusMsg: "No Product found in your area"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }
               let responseData = JSON.stringify({
                  statusMsg: "Product found.",
                  product: product,
                  details: genericProduct,


               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            });
         }
      );
   }
}
module.exports = GetProduct;