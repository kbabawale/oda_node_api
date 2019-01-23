var FCM = require("fcm-node");
var serverKey =
   "AAAAtQtusQI:APA91bF9z-OZaEIdocvR7GGLEzkbMEHYFvPQHVryf0vf9htq2mjXB8LG8yMApWkeIaUihGyHI6MefPi732ixWQbUaelYskKNO-9e4UiwaASuWWGx_TnZ074eCehUXQg0Kyb7VIEG9vRD";
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