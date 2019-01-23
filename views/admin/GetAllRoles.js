const ResponseObj = require("../../utilities/responsehandler");
let Roles = require("../../database/admin/adminroles");

class GetAllRoles{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.getRoles();
    }
    getRoles() {
        
        Roles.findAll({}).then(roles => {
            let responseData = JSON.stringify({
                roles: roles
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
        });
    }
}

module.exports = GetAllRoles;