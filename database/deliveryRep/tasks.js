const sequelize = require("../db");
const Sequelize = require("sequelize");
var SequelizeTokenify = require("sequelize-tokenify");

const Task = sequelize.define("deliveryRepTasks", {
   uid: {
      type: Sequelize.STRING(126),
      unique: true,
      primaryKey: true,
      set: function (val) {
         this.setDataValue("uid", "TK" + val);
      }
   },
   deliveryRepUid: {
      type: Sequelize.STRING(126)
   },
   orderUid: {
      type: Sequelize.STRING(126)
   },
   status: {
      type: Sequelize.STRING(126),
      defaultValue: "PENDING"
   }
});

SequelizeTokenify.tokenify(Task, {
   field: "uid",
   charset: "numeric",
   length: 12
});

module.exports = Task;
//