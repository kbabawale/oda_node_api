const sequelize = require("../db");
const Sequelize = require("sequelize");
const Product = require("./storeProduct");

const storeSalesProduct = sequelize.define(
   "storesalesproduct",
   {
      weight: { type: Sequelize.STRING(126) },
      price: { type: Sequelize.DECIMAL(10, 2) },
      displayPrice: { type: Sequelize.DECIMAL(10, 2) },
      quantity: { type: Sequelize.INTEGER },
      vat: { type: Sequelize.DECIMAL(5, 2) },
      status: { type: Sequelize.STRING(126) },
      soldOut: { type: Sequelize.BOOLEAN, defaultValue: false }
   },
   {
      timestamps: true
   }
);

Product.hasMany(storeSalesProduct);

module.exports = storeSalesProduct;
