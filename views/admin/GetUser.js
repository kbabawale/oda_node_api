const ResponseObj = require("../../utilities/responsehandler");
let Users = require("../../database/authentication/users");

class GetUser{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.getUsers();
    }
    getUsers() {

        const { uid } = this.data;
        
        Users.findOne({ where: { uid: uid } }).then(user => {
            if(user.length == 0){
                let responseData = JSON.stringify({
                    statusMsg: "An Error Occurred. Cannot Fetch User Details."
                });
                return ResponseObj.responseHandlers(400, this.res, responseData);    
            }

            let responseData = JSON.stringify({
                users: user
            });
            return ResponseObj.responseHandlers(200, this.res, responseData);
        });
    }
}

module.exports = GetUser;