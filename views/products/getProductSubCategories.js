const ResponseObj = require("../../utilities/responsehandler");
let category = require("../../database/products/category");
let subcategory = require("../../database/products/subcategory");

class SubGetCategory {
   constructor(req, res) {
      this.data = req;
      this.res = res;
      this.getAllSubCategories();
   }

   getAllSubCategories() {
      let categoryId = this.data.query.categoryId;
      category.findOne({ where: { id: categoryId } }).then(category => {
         if (category == null) {
            let responseData = JSON.stringify({
               statusMsg: "Category not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         subcategory
            .findAll({ where: { categoryId: categoryId } })
            .then(subcategories => {
               if (subcategories.length == 0) {
                  let responseData = JSON.stringify({
                     statusMsg: "Sub categories not found"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }
               let responseData = JSON.stringify({
                  categoryName: category.dataValues.name,
                  categoryId: categoryId,
                  subCategories: subcategories
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            });
      });
   }
}

module.exports = SubGetCategory;
