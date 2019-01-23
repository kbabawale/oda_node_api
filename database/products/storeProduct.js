const sequelize = require("../db");
const Sequelize = require("sequelize");
const Store = require("../store/store");
const GenericProduct = require("../products/genericProduct");
var SequelizeTokenify = require("sequelize-tokenify");

const Product = sequelize.define(
   "product",
   {
      uid: {
         type: Sequelize.STRING(126),
         unique: true,
         primaryKey: true,
         set: function(val) {
            this.setDataValue("uid", "P" + val);
         }
      },
      status: { type: Sequelize.STRING(126), defaultValue: "ACTIVE" },
      price: { type: Sequelize.DECIMAL(10, 2) },
      displayPrice: { type: Sequelize.DECIMAL(10, 2) },
      quantity: { type: Sequelize.INTEGER },
      location: { type: Sequelize.GEOMETRY },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false }
   },
   {
      timestamps: true
   }
);

SequelizeTokenify.tokenify(Product, {
   field: "uid",
   charset: "numeric",
   length: 7
});

Store.hasMany(Product);
GenericProduct.hasMany(Product);

module.exports = Product;
