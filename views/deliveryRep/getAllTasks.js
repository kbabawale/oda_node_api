const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Task = require("../../database/deliveryRep/tasks");
let Order = require("../../database/orders/orderSummary");
let OrderDetails = require("../../database/orders/orderDetails");

class GetAllTasks {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getAllTasks();
   }

   getAllTasks() {
      const {
         userId
      } = this.data;
      //authenticate rep
      User.findOne({
         where: {
            uid: userId,
            registerAs: 'DELIVERY REP'
         }
      }).then(user => {
         if (user == null) {
            let responseData = JSON.stringify({
               statusMsg: "User not found"
            });
            return ResponseObj.responseHandlers(400, this.res, responseData);
         }

         // Todo: Check if the user is delivery rep
         //fetch task
         Task.findAll({
            where: {
               deliveryRepUid: userId
            }
         }).then(
            taskdetails => {
               if (taskdetails.length == 0) {
                  let responseData = JSON.stringify({
                     statusMsg: "Task not found"
                  });
                  return ResponseObj.responseHandlers(
                     400,
                     this.res,
                     responseData
                  );
               } else {
                  let responseData = JSON.stringify({
                     statusMsg: "All Tasks",
                     task: taskdetails
                  });

                  return ResponseObj.responseHandlers(
                     200,
                     this.res,
                     responseData
                  );


               }
            }
         );
      });
   }
}

module.exports = GetAllTasks;