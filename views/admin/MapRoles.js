const ResponseObj = require("../../utilities/responsehandler");
let Roles = require("../../database/admin/adminroles");
let RolesMapping = require("../../database/admin/adminrolesmapping");

class MapRoles{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.mapRoles();
    }
    mapRoles() {
        let { role_ids, user_id } = this.data;
        
        //delete all entries of user mapping
        RolesMapping.destroy({where: {user_id: user_id}});

        //create fresh new instances of mapping
        role_ids=role_ids.split(',');
        role_ids.forEach((role, index) => {
            role = role.trim();
            RolesMapping.create({
                user_id: user_id,
                role_id: role
            });
            if (index == role_ids.length - 1){
                let responseData = JSON.stringify({
                    statusMsg: "Roles Mapped",
                });
                return ResponseObj.responseHandlers(
                    200,
                    this.res,
                    responseData
                );
            }
        });
    }
}

module.exports = MapRoles;
