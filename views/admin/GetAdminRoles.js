const ResponseObj = require("../../utilities/responsehandler");
let Roles = require("../../database/admin/adminroles");
let Rolesmapping = require("../../database/admin/adminrolesmapping");

class GetRoles {
   constructor(req, res) {
      this.data = req.body;
      this.res = res;
      this.getUserRoles();
      
   }

   getUserRoles() {
    const { UserId } = this.data;
   
   
    Rolesmapping.findAll({ where: { user_id: UserId } }).then(rolesmapping => {
        if (rolesmapping.length == 0) {
           let responseData = JSON.stringify({
              statusMsg: "No Roles Assigned To This User"
           });
           return ResponseObj.responseHandlers(400, this.res, responseData);
        }

        //get role names from role ids
        let rolesArray = []
        rolesmapping.forEach((role, index) => {
            Roles.findOne({where:{id: role.dataValues.role_id}}).then(role_name => {
                rolesArray.push(role_name.dataValues.roleName);
                if (index == rolesmapping.length - 1){
                    let responseData = JSON.stringify({
                        statusMsg: "Roles Found",
                        roleNames: rolesArray
                     });
                     return ResponseObj.responseHandlers(
                        200,
                        this.res,
                        responseData
                     );
                }
            });
            
        });
        

        
     });
   }
}

module.exports = GetRoles;
