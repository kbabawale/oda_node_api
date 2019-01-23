const sequelize = require("../db");
const Sequelize = require("sequelize");
var SequelizeTokenify = require("sequelize-tokenify");

const BrandProduct = sequelize.define(
   "brandproduct",
   {
      title: { type: Sequelize.STRING(126) },
      uid: {
         type: Sequelize.STRING(126),
         unique: true,
         primaryKey: true,
         set: function(val) {
            this.setDataValue("uid", "BP" + val);
         }
      },
      description: { type: Sequelize.TEXT() },
      weight: { type: Sequelize.STRING(126) },
      category: { type: Sequelize.STRING(126) },
      subcategory: { type: Sequelize.STRING(126) },
      images: {
         type: Sequelize.ARRAY(Sequelize.STRING(126))
      },
      createdBy: { type: Sequelize.STRING(126) },
      status : { type: Sequelize.STRING(126), defaultValue: "0" }, //0=pending,1=approved,2=declined
      comments : { type: Sequelize.STRING(200) } //reasons for declination
   },
   {
      timestamps: true
   }
);

SequelizeTokenify.tokenify(BrandProduct, {
   field: "uid",
   charset: "numeric",
   length: 7
});

module.exports = BrandProduct;
