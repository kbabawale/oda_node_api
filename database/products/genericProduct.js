const sequelize = require("../db");
const Sequelize = require("sequelize");
var SequelizeTokenify = require("sequelize-tokenify");

const GenericProduct = sequelize.define(
   "genericproduct",
   {
      title: { type: Sequelize.STRING(126) },
      uid: {
         type: Sequelize.STRING(126),
         unique: true,
         primaryKey: true,
         set: function(val) {
            this.setDataValue("uid", "GP" + val);
         }
      },
      description: { type: Sequelize.TEXT() },
      weight: { type: Sequelize.STRING(126) },
      category: { type: Sequelize.STRING(126) },
      subcategory: { type: Sequelize.STRING(126) },
      images: {
         type: Sequelize.ARRAY(Sequelize.STRING(126))
      }
   },
   {
      timestamps: true
   }
);

SequelizeTokenify.tokenify(GenericProduct, {
   field: "uid",
   charset: "numeric",
   length: 7
});

module.exports = GenericProduct;
//
