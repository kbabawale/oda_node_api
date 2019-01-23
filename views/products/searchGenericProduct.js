const ResponseObj = require("../../utilities/responsehandler");
const GenericProduct = require("../../database/products/genericProduct");

class SearchGenericProduct {
   constructor(data, res) {
      this.title = data.query.title;
      this.res = res;
      this.searchGeneric();
   }
   searchGeneric() {
      GenericProduct.findAll({
         where: { title: { $ilike: "%" + this.title + "%" } }
      }).then(results => {
         let responseData = JSON.stringify({
            statusMsg: "Search results",
            results: results
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = SearchGenericProduct;
