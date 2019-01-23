const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let validator = require("validator");
let cache = require("../../cache");

const userRoles = {
   1: "MERCHANT",
   2: "DELIVERY REP",
   3: "ADMIN",
   4: "MASTER ADMIN"
};

class UpdateAccount {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.update();
   }
   validateData() {
      
      const {
         uid,
         register_as
      } = this.data;
      
      // uid validation
      if (
         uid == undefined) {
         return { state: false, errorMsg: "Uid not defined." };
      }

      // register_as validation
      if (
         register_as == undefined ||
         Object.keys(userRoles).includes(register_as.toString()) == false
      ) {
         return {
            state: false,
            errorMsg: "Register_as value not recognized"
         };
      }
    
      return { state: true };
   
   }
   update() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            uid,
            register_as,
            address,
            date_of_birth,
            vehicleType
         } = this.data;

         User.findOne({ where: { uid: uid } }).then(user => {
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "This user was not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            user.update({
               date_of_birth: date_of_birth,
               registerAs: userRoles[register_as],
               vehicletype: vehicleType,
               address: address
            });
            let responseData = JSON.stringify({
               statusMsg: "User Type Updated Successfully."
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

module.exports = UpdateAccount;
