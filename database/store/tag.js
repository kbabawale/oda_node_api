const sequelize = require("../db");
const Sequelize = require("sequelize");
const Store = require("./store");

const Tag = sequelize.define("storetag", {
   tag: { type: Sequelize.STRING(126) }
});

Store.hasMany(Tag);

module.exports = Tag;
