const ResponseObj = require("../../utilities/responsehandler");
let StoreType = require("../../database/store/storeType");

class DeleteStoreType {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doDelete();
   }

   doDelete() {
      
      const { id } = this.data;
      
      StoreType.destroy({ where: { id: id } });
         
         StoreType.findOne({where: {id : id}}).then(found => {
               if(found == null){
                  let responseData = JSON.stringify({
                     statusMsg: "Store Type Deleted."
                  });
                  return ResponseObj.responseHandlers(200, this.res, responseData);
               }else{
                  let responseData = JSON.stringify({
                     statusMsg: "Couldnt Delete Store Type."
                  });
                  return ResponseObj.responseHandlers(400, this.res, responseData);
               }
         });
   }
}

module.exports = DeleteStoreType;
