const ResponseObj = require("../../utilities/responsehandler");
let Category = require("../../database/products/category");
let Subcategory = require("../../database/products/subcategory");
let NewGenericProduct = require("../../database/products/genericProduct");

class GenericProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createGeneric();
   }
   validate() {
      return {
         state: true
      };
   }
   createGeneric() {
      let validated = this.validate();
      if (validated.state) {
         const {
            title,
            description,
            weight,
            categoryId,
            subcategoryId,
            imageURL
         } = this.data;
         Category.findOne({ where: { id: categoryId } }).then(category => {
            if (category == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Category not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            Subcategory.findOne({
               where: { id: subcategoryId, categoryId: category.id }
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

               NewGenericProduct.create({
                  title: title,
                  description: description,
                  weight: weight,
                  category: category.dataValues.name,
                  subcategory: subcategory.dataValues.name,
                  images: imageURL
               }).then(newproduct => {
                  let responseData = JSON.stringify({
                     statusMsg: "Generic Product upload successful",
                     genericProduct: newproduct
                  });
                  return ResponseObj.responseHandlers(
                     200,
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

module.exports = GenericProduct;
