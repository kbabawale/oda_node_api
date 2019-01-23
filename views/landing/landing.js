const ResponseObj = require("../../utilities/responsehandler");
let GenericProduct = require("../../database/products/genericProduct");
let Category = require("../../database/products/category");

const numPerPage = 20;

class Landing {
   constructor(data, res) {
      this.res = res;
      this.doLanding();
   }
   doLanding() {
      Category.findAll().then(categories => {
         if (categories.length == 0) {
            let responseData = JSON.stringify({
               statusMsg: "No categories found."
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         let promiseTracker = 0;
         let listOfCategores = [];
         categories.forEach(category => {
            GenericProduct.count({
               where: { category: category.dataValues.name }
            }).then(count => {
               let payload = {
                  category: category.dataValues.name,
                  categoryId: category.dataValues.id,
                  numOfPages: Math.ceil(count / numPerPage),
                  numOfProducts: count
               };
               GenericProduct.findAll({
                  where: { category: category.dataValues.name },
                  limit: 15
               }).then(genproducts => {
                  promiseTracker++;

                  if (genproducts.length == 0) {
                     payload.products = [];
                     listOfCategores.push(payload);
                     if (promiseTracker == categories.length) {
                        let responseData = JSON.stringify({
                           statusMsg: "Landing products",
                           categories: listOfCategores
                        });
                        return ResponseObj.responseHandlers(
                           200,
                           this.res,
                           responseData
                        );
                     }
                  } else {
                     payload.products = genproducts;
                     listOfCategores.push(payload);
                     if (promiseTracker == categories.length) {
                        let responseData = JSON.stringify({
                           statusMsg: "Landing products",
                           categories: listOfCategores
                        });
                        return ResponseObj.responseHandlers(
                           200,
                           this.res,
                           responseData
                        );
                     }
                  }
               });
            });
         });
      });
   }
}

module.exports = Landing;
