const ResponseObj = require("../../utilities/responsehandler");
const validatePassword = require("../../utilities/validatePassword");
let User = require("../../database/authentication/users");
let Store = require("../../database/store/store");
let jwt = require("jsonwebtoken");

class Login {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.dologin();
   }

   dologin() {
      const { password, type, fcmToken } = this.data;

      // Login by Mobile
      if (type == "mobile" || type == "Mobile" || type == "MOBILE") {
         let mobile = this.data.mobile;
         User.findOne({ where: { mobile: mobile } }).then(user => {
            // No record found
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Invalid Login Details"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            user.update({ fcmtoken: fcmToken });

            // Blocked User
            if (user.dataValues.blocked == true) {
               let responseData = JSON.stringify({
                  statusMsg: "User Blocked"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            // Validate password
            if (validatePassword(password, user.password)) {
               // Find the stores
               Store.findAll({ where: { userUid: user.uid } })
                  .then(stores => {
                     delete user.dataValues.password;
                     let token = jwt.sign(
                        {
                           email: user.dataValues.email,
                           mobile: user.dataValues.mobile,
                           registerAs: user.dataValues.registerAs,
                           userId: user.dataValues.uid
                        },
                        process.env.SECRETKEY,
                        { expiresIn: "14d" } // Expires in 14 days
                     );

                     let responseData = JSON.stringify({
                        statusMsg: "User Logged In",
                        token: token,
                        user: user,
                        storeCount: stores.length,
                        stores: stores
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
            } else {
               // Invalid Password
               let responseData = JSON.stringify({
                  statusMsg: "Invalid Login Details"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
         });
      }

      // Login By Email
      else if (type == "email" || type == "Email" || type == "EMAIL") {
         let email = this.data.email;
         User.findOne({ where: { email: email } }).then(user => {
            // No record found
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Invalid Login Details"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            user.update({
               fcmtoken: fcmToken
            });

            // Blocked user
            if (user.dataValues.blocked == true) {
               let responseData = JSON.stringify({
                  statusMsg: "User Blocked"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }

            // Validate Password
            if (validatePassword(password, user.password)) {
               // Find the stores
               Store.findAll({ where: { userUid: user.uid } })
                  .then(stores => {
                     delete user.dataValues.password;
                     let token = jwt.sign(
                        {
                           email: user.dataValues.email,
                           mobile: user.dataValues.mobile,
                           registerAs: user.dataValues.registerAs,
                           userId: user.dataValues.uid
                        },
                        process.env.SECRETKEY,
                        { expiresIn: "14d" }
                     );

                     let responseData = JSON.stringify({
                        statusMsg: "User Logged In",
                        token: token,
                        user: user,
                        storeCount: stores.length,
                        stores: stores
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
            } else {
               // Invalid Password
               let responseData = JSON.stringify({
                  statusMsg: "Invalid Login Details"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
         });
      } else {
         // Invalid Selection Type
         let responseData = JSON.stringify({
            statusMsg: "Invalid Login Details"
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = Login;
