const ResponseObj = require("../../utilities/responsehandler");
let Users = require("../../database/authentication/users");

const toggleString = {
   "0": "deleted",
   "1": "activated"
};

class DeleteAccount {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doDelete();
   }

   validateData() {
      const { toggle } = this.data;
      if (Object.keys(toggleString).includes(toggle) == false) {
         return {
            state: false,
            errorMsg: "Invalid toggle flag"
         };
      }
      return {
         state: true
      };
   }

   doDelete() {
      let validate = this.validateData();
      if (validate.state) {
         const { uid, toggle } = this.data;
         Users.findOne({ where: { uid: uid } }).then(user => {
            if (user == null) {
               let responseData = JSON.stringify({
                  statusMsg: "User not found."
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            }
            let status;
            // If toggle = 1, activate user
            if (toggle == "1") {
               user.update({
                  blocked: false
               });
               status = "activated";
            }
            // if toggle = 0, delete user
            if (toggle == "0") {
               user.update({
                  blocked: true
               });
               status = "deleted";
            }

            let responseData = JSON.stringify({
               statusMsg: "User " + status
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
         });
      } else {
         let responseData = JSON.stringify({
            statusMsg: validate.errorMsg
         });
         return ResponseObj.responseHandlers(400, this.res, responseData);
      }
   }
}

module.exports = DeleteAccount;
