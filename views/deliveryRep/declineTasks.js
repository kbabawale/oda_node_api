const ResponseObj = require("../../utilities/responsehandler");
let User = require("../../database/authentication/users");
let Task = require("../../database/deliveryRep/tasks");


class DeclineTask {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.declineTask();
   }

   declineTask() {
      const {
         userId,
         task_id
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


         //fetch task
         Task.findOne({
            where: {
               uid: task_id,
            }
         }).then(task => {
            if (task == null) {
               let responseData = JSON.stringify({
                  statusMsg: "Task not found"
               });
               return ResponseObj.responseHandlers(400, this.res, responseData);
            } else {
               //update status
               task
                  .update({
                     status: "DECLINED"
                  })
                  .then(taskdeclined => {
                     let responseData = JSON.stringify({
                        statusMsg: "Task Accepted",
                        task: taskdeclined
                     });

                     return ResponseObj.responseHandlers(
                        200,
                        this.res,
                        responseData
                     );

                  });
            }
         });
      });
   }
}

module.exports = DeclineTask;