const ResponseObj = require("../../utilities/responsehandler");
let MarketLead = require("../../database/authentication/marketLeads");

class DeleteMarketLead {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doDelete();
   }

   doDelete() {
         const { refererCode } = this.data;
         
         MarketLead.destroy({ where: { refererCode: refererCode } });
            
            MarketLead.findOne({where: {refererCode : refererCode}}).then(found => {
                if(found == null){
                    let responseData = JSON.stringify({
                        statusMsg: "Market Leader Deleted."
                     });
                     return ResponseObj.responseHandlers(200, this.res, responseData);
                }else{
                    let responseData = JSON.stringify({
                        statusMsg: "Couldnt Delete Market Leader."
                     });
                     return ResponseObj.responseHandlers(400, this.res, responseData);
                }
            });
               
            
         
      
   }
}

module.exports = DeleteMarketLead;
