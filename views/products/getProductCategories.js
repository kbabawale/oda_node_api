const ResponseObj = require("../../utilities/responsehandler");
let category = require("../../database/products/category");

class GetCategory {
   constructor(req, res) {
      this.data = req.body;
      this.res = res;
      this.getAllCategories();
   }

   getAllCategories() {
      category.findAll({}).then(categories => {
         let responseData = JSON.stringify({
            categories: categories
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = GetCategory;
