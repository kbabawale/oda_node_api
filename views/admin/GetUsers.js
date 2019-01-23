const ResponseObj = require("../../utilities/responsehandler");
let Users = require("../../database/authentication/users");

class GetUsers{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.getUserss();
    }
    getUserss() {
        
        Users.findAll({}).then(user => {
            let responseData = JSON.stringify({
                users: user
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
        });
    }
}

module.exports = GetUsers;