const ResponseObj = require("../../utilities/responsehandler");
let GenericProduct = require("../../database/products/genericProduct");
let Category = require("../../database/products/category");

const numPerPage = 20;

class Page {
   constructor(data, res) {
      this.page = data.query.page;
      this.category = data.query.category;
      this.res = res;
      this.getPage();
   }

   calculateOffset(page) {
      return page * numPerPage - numPerPage;
   }

   getPage() {
      if (this.page < 1 || Number.isInteger(parseInt(this.page)) == false) {
         let responseData = JSON.stringify({
            statusMsg: "Invalid page number"
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
      Category.findOne({ where: { id: this.category } }).then(category => {
         if (category == null) {
            let responseData = JSON.stringify({
               statusMsg: "Category not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         GenericProduct.findAll({
            where: { category: category.dataValues.name },
            offset: this.calculateOffset(this.page),
            limit: numPerPage
         }).then(genproducts => {
            let responseData = JSON.stringify({
               statusMsg: "Products",
               page: this.page,
               numOfProducts: genproducts.length,
               products: genproducts
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         });
      });
   }
}

module.exports = Page;
