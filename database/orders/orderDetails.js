const sequelize = require("../db");
const Sequelize = require("sequelize");
const OrderSummary = require("./orderSummary");
const Store = require("../store/store");
const Product = require("../products/storeProduct");
var SequelizeTokenify = require("sequelize-tokenify");

const OrderDetails = sequelize.define("orderdetails", {
   uid: {
      type: Sequelize.STRING(126),
      unique: true,
      primaryKey: true,
      set: function(val) {
         this.setDataValue("uid", "OD" + val);
      }
   },
   productTitle: { type: Sequelize.STRING(126) },
   price: { type: Sequelize.DECIMAL },
   storeName: { type: Sequelize.STRING(126) },
   status: { type: Sequelize.STRING(126) }, // PENDING, ACCEPTED OR DECLINED
   quantity: { type: Sequelize.STRING(126) },
   unitOfMeasure: { type: Sequelize.STRING(126) },
   declineNumber: { type: Sequelize.INTEGER, defaultValue: 0 }
});

SequelizeTokenify.tokenify(OrderDetails, {
   field: "uid",
   charset: "numeric",
   length: 12
});

Store.hasMany(OrderDetails);
Product.hasMany(OrderDetails);
OrderSummary.hasMany(OrderDetails);

module.exports = OrderDetails;
