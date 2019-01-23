const ResponseObj = require("../../utilities/responsehandler");
let UOM = require("../../database/products/uom");

class GetUOM {
   constructor(req, res) {
      this.unitOfMeasure();
   }

   unitOfMeasure() {
      UOM.findAll({}).then(unitOfMeasure => {
         let responseData = JSON.stringify({
            unitOfMeasure: unitOfMeasure
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = GetUOM;
