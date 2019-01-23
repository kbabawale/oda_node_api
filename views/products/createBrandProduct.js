const ResponseObj = require("../../utilities/responsehandler");
let Category = require("../../database/products/category");
let Subcategory = require("../../database/products/subcategory");
let NewBrandProduct = require("../../database/products/brandProduct");

class BrandProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createBrand();
   }
   validate() {

      const {
         merchantId
      } = this.data;
      
      if (
         merchantId == undefined || merchantId == '') {
         return { state: false, errorMsg: "Provide Merchant Id" };
      }

      return {
         state: true
      };
   }
   createBrand() {
      let validated = this.validate();
      if (validated.state) {
         const {
            title,
            description,
            weight,
            categoryId,
            subcategoryId,
            imageURL,
            merchantId
         } = this.data;
         Category.findOne({ where: { id: categoryId } }).then(category => {
            if (category == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Category not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            Subcategory.findOne({
               where: { id: subcategoryId, categoryId: category.dataValues.id }
            }).then(subcategory => {
               if (subcategory == null) {
                  let responseData = JSON.stringify({
                     statusMsg: "Subcategory not found"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }
               
               var status = 0;
               NewBrandProduct.create({
                  title: title,
                  description: description,
                  weight: weight,
                  category: category.dataValues.name,
                  subcategory: subcategory.dataValues.name,
                  images: imageURL,
                  createdBy: merchantId,
                  status: status
               })
                  .then(newproduct => {
                     let responseData = JSON.stringify({
                        statusMsg: "Brand Product Creation Successful",
                        product: newproduct
                     });
                     return ResponseObj.responseHandlers(
                        200,
                        this.res,
                        responseData
                     );
                  })
                  .catch(err => {
                     let responseData = JSON.stringify({
                        statusMsg: err
                     });
                     return ResponseObj.responseHandlers(
                        400,
                        this.res,
                        responseData
                     );
                  });
            });
         });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = BrandProduct;
