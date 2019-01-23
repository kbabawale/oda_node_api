const ResponseObj = require("../../utilities/responsehandler");
const validator = require("validator");
let NewStore = require("../../database/store/store");
let User = require("../../database/authentication/users");

//

class Store {
   constructor(data, res) {
      this.data = data.body;
      this.userData = data.userData;
      this.res = res;
      this.createStore();
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
         validator.isAlphanumeric(name.split(" ")
            .join("")
            .split(",")
            .join("")
            .split(".")
            .join("")
            .split("-")
            .join("")
            .split("/")
            .join("")
            .split("&")
            .join("")
            .split("(")
            .join("")
            .split("(")
            .join("")
            .split(")")
            .join("")
            .split(".")
            .join("")
            .split("-")
            .join("")) == false
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
            .split(".")
            .join("")
            .split("-")
            .join("")
            .split("/")
            .join("")
            .split("&")
            .join("")
            .split("(")
            .join("")
            .split("(")
            .join("")
            .split(")")
            .join("")
            .split(".")
            .join("")
            .split("-")
            .join("")
         ) == false
      ) {
         return {
            state: false,
            errorMsg: "Address is not valid"
         };
      }

      // validate longitude
      if (
         longitude == undefined ||
         validator.isEmpty(longitude) ||
         validator.isNumeric(longitude) == false
      ) {
         return {
            state: false,
            errorMsg: "Longitude is not valid"
         };
      }

      // validate latitude
      if (
         latitude == undefined ||
         validator.isEmpty(latitude) ||
         validator.isNumeric(latitude) == false
      ) {
         return {
            state: false,
            errorMsg: "Latitude is not valid"
         };
      }

      // validate storeType
      if (
         storeType == undefined ||
         validator.isEmpty(storeType) ||
         validator.isAlphanumeric(
            storeType
            .split(" ")
            .join("")
            .split(",")
            .join("")
            .split(".")
            .join("")
            .split("-")
            .join("")
            .split("/")
            .join("")
            .split("&")
            .join("")
            .split("(")
            .join("")
            .split("(")
            .join("")
            .split(")")
            .join("")
            .split(".")
            .join("")
            .split("-")
            .join("")
         ) == false
      ) {
         return {
            state: false,
            errorMsg: "Store type is not valid"
         };
      }

      // validate storeFront
      if (
         storeFront == undefined ||
         validator.isEmpty(storeFront) ||
         validator.isURL(storeFront) == false
      ) {
         return {
            state: false,
            errorMsg: "Store front must be a valid cloudinary URL"
         };
      }

      // validate storeLogo
      if (
         storeLogo == undefined ||
         (validator.isEmpty(storeLogo) == false &&
            validator.isURL(storeLogo) == false)
      ) {
         return {
            state: false,
            errorMsg: "Store logo must be a valid cloudinary URL"
         };
      }

      return {
         state: true
      };
   }

   createStore() {
      let userId = this.userData.userId;

      let validated = this.validateData();
      if (validated.state) {
         const {
            name,
            address,
            longitude,
            latitude,
            storeType,
            storeFront,
            storeLogo
         } = this.data;

         User.findOne({
            where: {
               uid: userId
            }
         }).then(user => {
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "This user does not exist"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            let storeLocation = {
               type: "Point",
               coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };

            NewStore.create({
                  userUid: userId,
                  name: name,
                  address: address,
                  location: storeLocation,
                  storeType: storeType,
                  storeFront: storeFront,
                  storeLogo: storeLogo
               })
               .then(store => {
                  let responseData = JSON.stringify({
                     statusMsg: "Store sucessfully created",
                     userId: userId,
                     store: {
                        deleted: store.dataValues.deleted,
                        uid: store.dataValues.uid,
                        userUid: store.dataValues.userUid,
                        name: store.dataValues.name,
                        address: store.dataValues.address,
                        longitude: longitude,
                        latitude: latitude,
                        storeType: store.dataValues.storeType,
                        storeFront: store.dataValues.storeFront,
                        storeLogo: store.dataValues.storeLogo,
                        updatedAt: store.dataValues.updatedAt,
                        createdAt: store.dataValues.createdAt
                     }
                  });
                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               })

               .catch(err => {
                  let responseData = JSON.stringify({
                     statusMsg: err
                  });
                  return ResponseObj.responseHandlers(
                     400,
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
//

//

module.exports = Store;
//