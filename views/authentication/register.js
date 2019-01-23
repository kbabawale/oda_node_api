const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let jwt = require("jsonwebtoken");
let validator = require("validator");
let cache = require("../../cache");

const userRoles = {
   1: "MERCHANT",
   2: "DELIVERY REP",
   3: "ADMIN",
   4: "MASTER ADMIN"
};

const genderRoles = ["MALE", "FEMALE"];

class Register {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doRegister();
   }

   validateData() {
      const {
         name,
         password,
         email,
         mobile,
         register_as,
         gender,
         address,
         date_of_birth,
         fcmToken,
         refererCode,
         vehicleType
      } = this.data;
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
      // password length validation
      if (
         password == undefined ||
         password.length < 4 ||
         password.length > 15
      ) {
         return {
            state: false,
            errorMsg: "Password must be between the range of 4 and 15"
         };
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
            errorMsg: "Register As is not Valid"
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
            errorMsg: "Invalid date of birth"
         };
      }

      if (
         vehicleType == undefined ||
         (register_as == 2 && validator.isEmpty(vehicleType))
      ) {
         return {
            state: false,
            errorMsg: "Vehicle Type must be defined for Del. Rep"
         };
      }

      if (fcmToken == undefined || validator.isEmpty(fcmToken)) {
         return { state: false, errorMsg: "FCM Token must be valid" };
      }

      if (refererCode == undefined) {
         return { state: false, errorMsg: "Referrer code must be declared" };
      }

      //

      return { state: true };
   }
   doRegister() {
      let validated = this.validateData();
      if (validated.state) {
         const {
            name,
            email,
            password,
            mobile,
            register_as,
            address,
            date_of_birth,
            gender,
            fcmToken,
            refererCode,
            vehicleType
         } = this.data;

         User.findOne({ where: { email: email } }).then(testuser => {
            if (testuser != null && email != "") {
               let responseData = JSON.stringify({
                  statusMsg: "Email already exists"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            User.create({
               fullName: name,
               gender: gender,
               email: email,
               password: password,
               mobile: mobile,
               registerAs: userRoles[register_as],
               address: address,
               date_of_birth: date_of_birth,
               fcmtoken: fcmToken,
               referer: refererCode,
               vehicletype: vehicleType
            })
               .then(user => {
                  const { email, mobile, register_as } = this.data;

                  let token = jwt.sign(
                     {
                        email: email,
                        mobile: mobile,
                        userId: user.uid,
                        registerAs: userRoles[register_as]
                     },
                     process.env.SECRETKEY,
                     { expiresIn: "14d" }
                  );
                  delete user.dataValues.password;
                  let responseData = JSON.stringify({
                     statusMsg: "User successfully created",
                     token: token,
                     user: user
                  });
                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );
               })
               .catch(err => {
                  let message;
                  if (err.name == "SequelizeUniqueConstraintError") {
                     message = "Phone number already exists.";
                  } else {
                     message = err;
                  }
                  let responseData = JSON.stringify({
                     statusMsg: message
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

module.exports = Register;
