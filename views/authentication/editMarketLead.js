const ResponseObj = require("../../utilities/responsehandler");
let MarketLead = require("../../database/authentication/marketLeads");
let validator = require("validator");

class EditMarketLead {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.editMarketLead();
   }

   validateData() {
      
      const { fullName, mobile, refererCode } = this.data;
      
      // uid validation
      if (
         refererCode == undefined) {
         return { state: false, errorMsg: "refererCode not defined." };
      }

      // name validation
      if (
         fullName == undefined ||
         validator.isAlpha(
            fullName
               .split(" ")
               .join("")
               .split("-")
               .join("")
         ) == false
      ) {
         return { state: false, errorMsg: "Name not valid." };
      }
      
      
      // mobile validation
      if (
         mobile == undefined ||
         validator.isNumeric(mobile) == false ||
         mobile.length < 11 ||
         mobile.length > 15
      ) {
         return { state: false, errorMsg: "Mobile number is invalid" };
      }

      return { state: true };
   
   }
   

   editMarketLead() {
      let validated = this.validateData();
      if (validated.state) {
         const { fullName, mobile, refererCode } = this.data;

         MarketLead.findOne({ where: { refererCode:refererCode } }).then(lead => {
            if (lead == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Market Leader was not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            lead.update({
               fullName: fullName,
               mobile: mobile
               
                
            });
            let responseData = JSON.stringify({
               statusMsg: "Market Leader Details Updated Successfully."
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
            
         });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = EditMarketLead;
