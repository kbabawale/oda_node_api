const ResponseObj = require("../../utilities/responsehandler");
const validatePassword = require("../../utilities/validatePassword");
let User = require("../../database/authentication/users");

class ValidatePassword {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doValidate();
   }

   doValidate() {
      const { userId, password } = this.data;
      User.findOne({ where: { uid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "Such User do not exist."
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         if (validatePassword(password, user.dataValues.password)) {
            let responseData = JSON.stringify({
               statusMsg: "Password validated."
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         }
         let responseData = JSON.stringify({
            statusMsg: "Password is invalid"
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      });
   }
}

module.exports = ValidatePassword;
