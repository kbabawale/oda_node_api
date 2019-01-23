const ResponseObj = require("../../utilities/responsehandler");
let Roles = require("../../database/admin/adminroles");
let validator = require("validator");
let cache = require("../../cache");

class CreateRole{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.doCreate();
    }
    validateData() {
        const {
           rolename
        } = this.data;
        // rolename validation
        if (
           rolename == undefined ||
           validator.isAlpha(
              name
                 .split(" ")
                 .join("")
                 .split("-")
                 .join("")
           ) == false
        ) {
           return { state: false, errorMsg: "Role Name not valid." };
        }
        
        // checks if rolename already exists in cache
        let exist = cache.get(rolename);
        if (exist) {
            return {
                state: false,
                errorMsg: "Role Name already exists"
            };
        }
        
        return { state: true };
    }

    doCreate() {
        
        let validated = this.validateData();
        if (validated.state) {
         
            const { rolename } = this.data;
            Roles.create({
                roleName: rolename
                
            }).then(role => {
                const { rolename } = this.data;
                if (rolename) {
                    // Add rolename to cache
                    cache.set(rolename, "exists");
                }

                let responseData = JSON.stringify({
                    statusMsg: "Role successfully created"
                });
                return ResponseObj.responseHandlers(200, this.res, responseData);
            });

        }
    }
}

module.exports = CreateRole;
