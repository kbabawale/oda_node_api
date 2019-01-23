const ResponseObj = require("../../utilities/responsehandler");
let MarketLead = require("../../database/authentication/marketLeads");

class CreateMarketLead {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createMarketLead();
   }

   validateData() {
      return {
         state: true,
         errorMsg: ""
      };
   }

   createMarketLead() {
      let validated = this.validateData();
      if (validated.state) {
         const { fullName, mobile, refererCode } = this.data;
         MarketLead.create({
            fullName: fullName,
            mobile: mobile,
            refererCode: refererCode
         })
            .then(marketlead => {
               let responseData = JSON.stringify({
                  statusMsg: "MarketLead successfully created",
                  marketlead: marketlead
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            })
            .catch(err => {
               let responseData = JSON.stringify({
                  statusMsg: "Something went wrong"
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

module.exports = CreateMarketLead;
