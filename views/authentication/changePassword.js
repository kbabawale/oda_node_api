const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");

class ChangePassword {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doChangePassword();
   }

   doChangePassword() {
      const { userId, password } = this.data;
      User.findOne({ where: { uid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "Such User do not exist."
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         } else {
            user.update({ password: password, firstreset: true });
            let responseData = JSON.stringify({
               statusMsg: "Password Changed."
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         }
      });
   }
}

module.exports = ChangePassword;
