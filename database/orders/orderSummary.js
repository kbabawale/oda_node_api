const sequelize = require("../db");
const Sequelize = require("sequelize");
var SequelizeTokenify = require("sequelize-tokenify");

const OrderSummary = sequelize.define("ordersummary", {
   uid: {
      type: Sequelize.STRING(126),
      unique: true,
      primaryKey: true,
      set: function(val) {
         this.setDataValue("uid", "OS" + val);
      }
   },
   productsCost: { type: Sequelize.DECIMAL, allowNull: false },
   deliveryCost: { type: Sequelize.DECIMAL, allowNull: false },
   totalCost: { type: Sequelize.DECIMAL, allowNull: false },
   status: { type: Sequelize.STRING },
   destinationLatitude: { type: Sequelize.FLOAT },
   destinationLongitude: { type: Sequelize.FLOAT },
   numberOfProducts: { type: Sequelize.INTEGER, allowNull: false },
   buyerUid: { type: Sequelize.STRING(126), allowNull: false }
});

SequelizeTokenify.tokenify(OrderSummary, {
   field: "uid",
   charset: "numeric",
   length: 12
});

module.exports = OrderSummary;
