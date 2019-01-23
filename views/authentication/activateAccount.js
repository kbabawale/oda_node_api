const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Location = require("../../database/deliveryRep/location");

class ActivateUser {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.doActivate();
   }

   doActivate() {
      const { userId } = this.data;
      User.findOne({ where: { uid: userId } }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }
         user.update({
            active: true,
            points: "10"
         });

         if (user.dataValues.registerAs == "DELIVERY REP") {
            Location.create({
               deliveryRepUid: user.dataValues.uid
            });
         }
         delete user.dataValues.password;
         let responseData = JSON.stringify({
            statusMsg: "User activated",
            user: user
         });
         return ResponseObj.responseHandlers(200, this.res, responseData);
      });
   }
}

module.exports = ActivateUser;
