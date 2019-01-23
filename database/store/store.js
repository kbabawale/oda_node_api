const sequelize = require("../db");
const Sequelize = require("sequelize");
let User = require("../authentication/users");
let SequelizeTokenify = require("sequelize-tokenify");

const Store = sequelize.define(
   "store",
   {
      uid: {
         type: Sequelize.STRING(126),
         primaryKey: true,
         set: function(val) {
            this.setDataValue("uid", "S" + val);
         }
      },
      name: { type: Sequelize.STRING(126) },
      address: { type: Sequelize.STRING(126) },
      location: { type: Sequelize.GEOMETRY },
      storeType: { type: Sequelize.STRING(126) },
      storeFront: { type: Sequelize.STRING(126) },
      storeLogo: { type: Sequelize.STRING(126) },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false }
   },
   {
      timestamps: true
   }
);
SequelizeTokenify.tokenify(Store, {
   field: "uid",
   charset: "numeric",
   length: 7
});

User.hasMany(Store);

module.exports = Store;

//
