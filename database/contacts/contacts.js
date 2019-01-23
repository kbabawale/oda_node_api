const sequelize = require("../db");
const Sequelize = require("sequelize");

const ContactList = sequelize.define("contactlist", {
   name: { type: Sequelize.STRING(126) },
   mobile: { type: Sequelize.STRING(126), unique: true, primaryKey: true },
   email: { type: Sequelize.STRING(126) },
   userUid: { type: Sequelize.STRING(126) }
});

module.exports = ContactList;
