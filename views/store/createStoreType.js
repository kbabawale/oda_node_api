const ResponseObj = require("../../utilities/responsehandler");
let StoreType = require("../../database/store/storeType");

class CreateStoreType {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createStoreType();
   }
   validateData() {
      return {
         state: true,
         errorMsg: ""
      };
   }
   createStoreType() {
      let validated = this.validateData();
      if (validated.state) {
         const { storeType } = this.data;
         StoreType.create({
            name: storeType
         })
            .then(type => {
               let responseData = JSON.stringify({
                  statusMsg: "Store Type added",
                  storeType: type
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            })
            .catch(err => {
               let responseData = JSON.stringify({
                  statusMsg: "Something wrong happened"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = CreateStoreType;
