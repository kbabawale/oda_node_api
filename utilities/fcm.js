var FCM = require("fcm-node");
//var serverKey = "";
//put your server key here
var fcm = new FCM(serverKey);

class Notification {
   constructor(registration_token, collapse_key, title, body, type, id = null) {
      this.message = {
         to: registration_token,
         collapse_key: collapse_key,

         notification: {
            title: title,
            body: body
         },

         data: {
            type_of_notification: type,
            id: id
         }
      };
   }

   send() {

      fcm.send(this.message, function (err, response) {
         if (err) {
            console.log("Something has gone wrong!");
            return
         } else {
            console.log("Successfully sent with response: ", response);
            return
         }
      });
   }
}

module.exports = Notification;
