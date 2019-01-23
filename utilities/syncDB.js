const user = require("../database/authentication/users");
const marketlead = require("../database/authentication/marketLeads");
const store = require("../database/store/store");
const category = require("../database/products/category");
const subcategory = require("../database/products/subcategory");
const uom = require("../database/products/uom");
const product = require("../database/products/storeProduct");
const ordersummary = require("../database/orders/orderSummary");
const orderdetails = require("../database/orders/orderDetails");
const genericproduct = require("../database/products/genericProduct");
const brandproduct = require("../database/products/brandProduct");
const tag = require("../database/store/tag");
const vehiclelist = require("../database/deliveryRep/vehicleList");
const adminroles = require("../database/admin/adminroles");
const adminrolesmapping = require("../database/admin/adminrolesmapping");
const contactlist = require("../database/contacts/contacts");
const storetype = require("../database/store/storeType");
const location = require("../database/deliveryRep/location");
const task = require("../database/deliveryRep/tasks");
const route = require("../database/deliveryRep/route");
const faresettings = require("../database/admin/fareSettngs");
const mainsettings = require("../database/admin/mainSettings")


const sync = () => {
   adminroles.sync();
   user.sync();
   adminrolesmapping.sync();
   store.sync();
   category.sync();
   subcategory.sync();
   uom.sync();
   product.sync();
   ordersummary.sync();
   orderdetails.sync();
   genericproduct.sync();
   tag.sync();
   marketlead.sync();
   vehiclelist.sync();
   contactlist.sync();
   storetype.sync();
   location.sync();
   brandproduct.sync();
   task.sync();
   route.sync();
   faresettings.sync();
   mainsettings.sync();
};
module.exports = sync;