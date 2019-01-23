const sequelize = require("../db");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
var SequelizeTokenify = require("sequelize-tokenify");
//let Roles = require("../../database/admin/adminroles");
let RolesMapping = require("../../database/admin/adminrolesmapping");

const User = sequelize.define(
   "user",
   {
      uid: {
         type: Sequelize.STRING(126),
         unique: true,
         primaryKey: true,
         set: function(val) {
            this.setDataValue("uid", "U" + val);
         }
      },
      fullName: { type: Sequelize.STRING(126) },

      email: {
         type: Sequelize.STRING(126)
      },
      gender: { type: Sequelize.STRING(126) },

      date_of_birth: { type: Sequelize.STRING(126) },

      password: {
         type: Sequelize.STRING(126),
         set: function(val) {
            let hash = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hash);
         }
      },
      mobile: { type: Sequelize.STRING(126), unique: true },
      referer: { type: Sequelize.STRING(126), unique: true },
      fcmtoken: { type: Sequelize.STRING(1234) },
      points: { type: Sequelize.STRING(126) },
      registerAs: { type: Sequelize.STRING(126) },
      address: { type: Sequelize.STRING(126) },
      active: { type: Sequelize.BOOLEAN, defaultValue: false },
      blocked: { type: Sequelize.BOOLEAN, defaultValue: false },
      vehicletype: { type: Sequelize.STRING(126) },
      firstreset: { type: Sequelize.BOOLEAN, defaultValue: false }
   },
   {
      timestamps: true
   }
);

SequelizeTokenify.tokenify(User, {
   field: "uid",
   charset: "numeric",
   length: 7
});

let rolesid = [1, 2, 3, 4, 5, 6];

//check if master admin exists
User.findOne({
   where: { registerAs: "4", email: "superadmin@gmail.com" }
}).then(userfound => {
   if (userfound == null) {
      //create a new user
      User.create({
         fullName: "Master-Admin Admin",
         gender: "MALE",
         email: "superadmin@gmail.com",
         password: "qwerty123456",
         mobile: "080234456694",
         registerAs: "4",
         address: "LandMark Building, Lagos",
         date_of_birth: "",
         fcmtoken: "",
         referer: "",
         vehicletype: ""
      }).then(usercreated => {
         //map roles to admin
         rolesid.forEach((role, index) => {
            RolesMapping.create({
               user_id: usercreated.dataValues.uid,
               role_id: role
            });
         });
      });
   }
});

//

module.exports = User;
