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

const genderRoles = ["MALE", "FEMALE"];

class UpdateAccount {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.update();
   }
   validateData() {
      
      const {
         uid,
         name,
         email,
         mobile,
         register_as,
         gender,
         address,
         date_of_birth,
         refererCode
      } = this.data;
      
      // uid validation
      if (
         uid == undefined) {
         return { state: false, errorMsg: "Uid not defined." };
      }

      //referer Code
      if (
         refererCode == undefined) {
         return { state: false, errorMsg: "Referer Code not defined." };
      }

      // name validation
      if (
         name == undefined ||
         validator.isAlpha(
            name
               .split(" ")
               .join("")
               .split("-")
               .join("")
         ) == false
      ) {
         return { state: false, errorMsg: "Name not valid." };
      }
      
      // email validation
      if (
         email == undefined ||
         (validator.isEmpty(email) == false &&
            validator.isEmail(email) == false)
      ) {
         return {
            state: false,
            errorMsg: "Email invalid"
         };
      }

      if (validator.isEmail(email)) {
         // checks if email already exists in cache
         let exist = cache.get(email);
         if (exist) {
            return {
               state: false,
               errorMsg: "Email already exists"
            };
         }
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
      // Address validation
      if (
         address == undefined ||
         (register_as == 1 &&
            validator.isEmpty(address) &&
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
            ) == false)
      ) {
         return { state: false, errorMsg: "Address is not valid" };
      }

      // gender validation
      if (
         gender == undefined ||
         (register_as == 2 &&
            validator.isEmpty(gender) &&
            genderRoles.includes(gender.toUpperCase()) == false)
      ) {
         return {
            state: false,
            errorMsg: "Invalid gender. Values must be either MALE or FEMALE"
         };
      }

      // dob validation
      if (
         date_of_birth == undefined ||
         (register_as == 2 && validator.isEmpty(date_of_birth))
      ) {
         return {
            state: false,
            errorMsg: "Invalid DOB"
         };
      }

      return { state: true };
   
   }
   update() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            uid,
            name,
            email,
            mobile,
            register_as,
            address,
            date_of_birth,
            gender,
            refererCode
         } = this.data;

         User.findOne({ where: { uid: uid } }).then(user => {
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "This user was not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            user.update({
               fullName: name,
               email: email,
               gender: gender, 
               mobile: mobile,
               date_of_birth: date_of_birth,
               registerAs: userRoles[register_as],
               address: address,
               referer: refererCode
            });
            let responseData = JSON.stringify({
               statusMsg: "User Updated Successfully."
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
