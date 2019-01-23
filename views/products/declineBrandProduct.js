const ResponseObj = require("../../utilities/responsehandler");
let NewBrandProduct = require("../../database/products/brandProduct");
let Notification = require("../../utilities/fcm");
let User = require("../../database/authentication/users");

class BrandProduct {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.createBrand();
   }
   validate() {

      const {
        brandProductId,
        comment
      } = this.data;
      
      if (
        brandProductId == undefined || brandProductId == '') {
         return { state: false, errorMsg: "Provide Brand Product Id" };
      }

      return {
         state: true
      };
   }
   createBrand() {
      let validated = this.validate();
      if (validated.state) {
         const {
            brandProductId,
            comment
         } = this.data;
         
         //get brand product and update its status,
         var stat = 2;
         NewBrandProduct.findOne({ where: {uid: brandProductId} }).then(found => {
             if(found == null){
                let responseData = JSON.stringify({
                    statusMsg: "Brand Product not found"
                 });
                 return ResponseObj.responseHandlers(400, this.res, responseData);
             }

             //if found, update table row
             found.update({
                 status: stat,
                 comments: comment
             });

             User.findOne({ where: {uid: found.dataValues.createdBy} }).then(userfound => {
                let notif = new Notification(
                    userfound.dataValues.fcmtoken,
                    "Brand Product Creation Declined",
                    "Brand Product Creation Declined",
                    "Brand Product Notification",
                    "Brand Product Creation Declined"
                 );
                 notif.send();
                 let responseData = JSON.stringify({
                    statusMsg: "Brand Product Declined Successfully"
                 });
                 return ResponseObj.responseHandlers(
                    200,
                    this.res,
                    responseData
                 );
             });
         });

      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = BrandProduct;
