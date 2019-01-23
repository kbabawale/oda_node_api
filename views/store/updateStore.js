const ResponseObj = require("../../utilities/responsehandler");
const validator = require("validator");
let Store = require("../../database/store/store");

class UpdateStore {
   constructor(data, res) {
      this.data = data.body;
      this.userData = data.userData;
      this.res = res;
      this.updateStore();
   }

   validateData() {
      const {
         name,
         address,
         longitude,
         latitude,
         storeType,
         storeFront,
         storeLogo
      } = this.data;

      // validate store name
      if (
         name == undefined ||
         validator.isEmpty(name) ||
         validator.isAlpha(name.split(" ").join("")) == false
      ) {
         return {
            state: false,
            errorMsg: "Name is not valid"
         };
      }

      // validate address
      if (
         address == undefined ||
         validator.isEmpty(address) ||
         validator.isAlphanumeric(
            address
               .split(" ")
               .join("")
               .split(",")
               .join("")
               .split("-")
               .join("")
         ) == false
      ) {
         return { state: false, errorMsg: "Address is not valid" };
      }

      // validate longitude
      if (
         longitude == undefined ||
         validator.isEmpty(longitude) ||
         validator.isNumeric(longitude) == false
      ) {
         return { state: false, errorMsg: "Longitude is not valid" };
      }

      // validate latitude
      if (
         latitude == undefined ||
         validator.isEmpty(latitude) ||
         validator.isNumeric(latitude) == false
      ) {
         return { state: false, errorMsg: "Latitude is not valid" };
      }

      // validate storeType
      if (
         storeType == undefined ||
         validator.isEmpty(storeType) ||
         validator.isAlpha(storeType) == false
      ) {
         return { state: false, errorMsg: "Store type is not valid" };
      }

      // validate storeFront
      if (
         storeFront == undefined ||
         validator.isEmpty(storeFront) ||
         validator.isURL(storeFront) == false
      ) {
         return {
            state: false,
            errorMsg: "Store front is must be a valid cloudinary URL"
         };
      }

      // validate storeLogo
      if (
         storeLogo == undefined ||
         validator.isEmpty(storeLogo) ||
         validator.isURL(storeLogo) == false
      ) {
         return {
            state: false,
            errorMsg: "Store logo is must be a valid cloudinary URL"
         };
      }

      return {
         state: true
      };
   }

   updateStore() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            userId,
            storeId,
            name,
            address,
            storeType,
            storeFront,
            storeLogo,
            longitude,
            latitude
         } = this.data;

         Store.findOne({ where: { uid: storeId, userUid: userId } }).then(
            store => {
               if (store == null) {
                  let responseData = JSON.stringify({
                     statusMsg: "This store is not found."
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               }

               let storeLocation = {
                  type: "Point",
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
               };

               store.update({
                  name: name,
                  address: address,
                  storeType: storeType,
                  storeLogo: storeLogo,
                  location: storeLocation
               });
               let responseData = JSON.stringify({
                  statusMsg: "Store sucessfully updated",
                  userId: userId,
                  store: store
               });
               return ResponseObj.responseHandlers(200, this.res, responseData);
            }
         );
      } else {
         let responseData = JSON.stringify({
            statusMsg: validated.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = UpdateStore;
