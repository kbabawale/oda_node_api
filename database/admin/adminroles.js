const sequelize = require("../db");
const Sequelize = require("sequelize");

//create table
const Adminroles = sequelize.define(
   "adminrole",
   {
      roleName: { type: Sequelize.STRING(126) }
   },
   {
      timestamps: true
   }
);

//insert values
const rolesArray = [
   "Users",
   "Admin-Accounts",
   "Orders",
   "Products",
   "Stores",
   "System-Setup"
];

rolesArray.forEach((role, index) => {
   //if value isnt already in db. insert it
   Adminroles.findOne({ where: { roleName: role } }).then(found => {
      if (found == null) {
         Adminroles.create({
            roleName: role
         });
      }
   });
});

module.exports = Adminroles;
// AA
//
