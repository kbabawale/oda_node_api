const ResponseObj = require("../../utilities/responsehandler");
let NewBrandProduct = require("../../database/products/brandProduct");
let NewGenericProduct = require("../../database/products/genericProduct");

class ApproveBrandProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.approve();
   }

   approve() {
      const { BrandProductId } = this.data;

      NewBrandProduct.findOne({ where: { uid: BrandProductId } }).then(
         found => {
            //add to generic product
            if (found == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Brand Product not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            var stat = 1;
            //update status of brand product to approved
            found.update({
               status: stat
            });

            NewGenericProduct.create({
               title: found.dataValues.title,
               description: found.dataValues.description,
               weight: found.dataValues.weight,
               category: found.dataValues.category,
               subcategory: found.dataValues.subcategory,
               images: found.dataValues.images
            }).then(added => {
               //found.destroy();
               let responseData = JSON.stringify({
                  statusMsg: "Brand Product approved",
                  product: added
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            });
         }
      );
   }
}

module.exports = ApproveBrandProduct;
