const ResponseObj = require("../../utilities/responsehandler");
let StoreType = require("../../database/store/storeType");

class GetStoreType {
   constructor(data, res) {
      this.res = res;
      this.getAllStoreTypes();
   }
   getAllStoreTypes() {
      StoreType.findAll({}).then(types => {
         let responseData = JSON.stringify({
            statusMsg: "All Store types",
            storeType: types
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}
module.exports = GetStoreType;
