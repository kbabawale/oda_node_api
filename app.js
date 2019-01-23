const express = require("express");
const bodyParser = require("body-parser");
const routeHandlers = require("./utilities/routehandler");
const Register = require("./views/authentication/register");
const UpdateAccount = require("./views/authentication/updateAccount");
const UpdateAccountType = require("./views/authentication/updateAccountType");
const ValidatePassword = require("./views/authentication/validatePassword");
const ChangePassword = require("./views/authentication/changePassword");
const Login = require("./views/authentication/login");
const Store = require("./views/store/createStore");
const ActivateUser = require("./views/authentication/activateAccount");
const UpdateStore = require("./views/store/updateStore");
const GetStoreDetails = require("./views/store/getStore");
const DeleteStore = require("./views/store/deleteStore");
const Product = require("./views/products/createProduct");
const GetProductDetails = require("./views/products/getProductDetails");
const CreateGenericProduct = require("./views/products/createGenericProduct");
const GenericProductSearch = require("./views/products/searchGenericProduct");
const DeleteProduct = require("./views/products/deleteProduct");
const UpdateProduct = require("./views/products/updateProduct");
const GetCategories = require("./views/products/getProductCategories");
const GetSubCategories = require("./views/products/getProductSubCategories");
const LandingPage = require("./views/landing/landing");
const CreateOrder = require("./views/orders/createOrder");
const CancelOrder = require("./views/orders/cancelOrder");
const CreateMarketLead = require("./views/authentication/createMarketLead");
const EditMarketLead = require("./views/authentication/editMarketLead");
const DeleteMarketLead = require("./views/authentication/deleteMarketLead");
const GetMarketLead = require("./views/authentication/getMarketLead");
const GetRoles = require("./views/admin/GetAdminRoles");
const GetUsers = require("./views/admin/GetUsers");
const GetUser = require("./views/admin/GetUser");
const CreateRole = require("./views/admin/CreateRole");
const CreateVehicle = require("./views/deliveryRep/createVehicle");
const GetVehicleList = require("./views/deliveryRep/getVehicleList");
const DeleteVehicle = require("./views/deliveryRep/deleteVehicle");
const CreateStoreType = require("./views/store/createStoreType");
const GetAllStoreTypes = require("./views/store/getStoreType");
const DeleteStoreType = require("./views/store/deleteStoreType");
const DeleteAccount = require("./views/authentication/deleteAccount");
const MapRoles = require("./views/admin/MapRoles");
const GetAllRoles = require("./views/admin/GetAllRoles");
const GetContacts = require("./views/getContacts");
const Available = require("./views/deliveryRep/availability");
const UpdateLocation = require("./views/deliveryRep/location");
const AllOrders = require("./views/orders/allOrders");
const PendingOrders = require("./views/orders/getAllPendingOrders");
const AcceptOrder = require("./views/orders/acceptOrder");
const DeclineOrder = require("./views/orders/declineOrder");
const LandingPageCategory = require("./views/landing/getPage");
const CreateBrandProduct = require("./views/products/createBrandProduct");
const ApproveBrandProduct = require("./views/products/approveBrandProduct");
const GetGenericProduct = require("./views/products/getGenericProduct");
const GetBrandProduct = require("./views/products/getBrandProduct");
const DeclineBrandProduct = require("./views/products/declineBrandProduct");
const AcceptTask = require("./views/deliveryRep/acceptTasks");
const DeclineTask = require("./views/deliveryRep/declineTasks");
const PickOffStart = require("./views/deliveryRep/pickOffStart");
const PickOffEnd = require("./views/deliveryRep/pickOffEnd");
const DropOffStart = require("./views/deliveryRep/dropOffStart");
const DropOffEnd = require("./views/deliveryRep/dropOffEnd");
const GetAllRoutes = require("./views/deliveryRep/getRoutes");
const GetAllTasks = require("./views/deliveryRep/getAllTasks");
const GetPendingTasks = require("./views/deliveryRep/getPendingTasks");
const GetLandingProduct = require("./views/landing/getProduct");
const GetSettings = require("./views/admin/getMainSettings");
const UpdateMainSettings = require("./views/admin/updateMainSettings");
const FareSettings = require("./views/admin/vehicleDelCost");
const GetVehicleDeliveryCost = require("./views/admin/getVehicleDelCost");

const Temp = require("./views/authentication/temp");

const app = express();
const dotenv = require("dotenv");
const path = require("path");
const auth = require("./utilities/authenticate");
const syncDB = require("./utilities/syncDB");

class SRServer {
   constructor() {
      this.initExpressRoute();
      this.initExpressStart();
   }

   initExpressRoute() {
      syncDB();
      app.use(bodyParser.urlencoded({
         extended: false
      }));
      app.use(bodyParser.json());

      // Custom token authentication middleware
      app.use(auth);

      let routes = JSON.parse(routeHandlers.handleRoutes());

      app.get("/api/ping/", (req, res) => {
         res.writeHeader(200, {
            "Content-Type": "text/html"
         });
         res.write("This is a test");
         res.end();
      });

      app.post(routes.register, (req, res) => {
         new Register(req, res);
      });

      app.post(routes.updateAccount, (req, res) => {
         new UpdateAccount(req, res);
      });

      app.post(routes.updateAccountType, (req, res) => {
         new UpdateAccountType(req, res);
      });

      app.post(routes.login, (req, res) => {
         new Login(req, res);
      });

      app.post(routes.createStore, (req, res) => {
         new Store(req, res);
      });

      app.post(routes.activateUser, (req, res) => {
         new ActivateUser(req, res);
      });

      app.post(routes.createProduct, (req, res) => {
         new Product(req, res);
      });

      app.get(routes.getProductCategories, (req, res) => {
         new GetCategories(req, res);
      });

      app.get(routes.getProductSubCategories, (req, res) => {
         new GetSubCategories(req, res);
      });

      app.get(routes.getProductDetails, (req, res) => {
         new GetProductDetails(req, res);
      });

      app.post(routes.validatePassword, (req, res) => {
         new ValidatePassword(req, res);
      });

      app.post(routes.changePassword, (req, res) => {
         new ChangePassword(req, res);
      });

      app.post(routes.updateStore, (req, res) => {
         new UpdateStore(req, res);
      });

      app.post(routes.getStoreDetails, (req, res) => {
         new GetStoreDetails(req, res);
      });

      app.post(routes.deleteStore, (req, res) => {
         new DeleteStore(req, res);
      });

      app.post(routes.createGenericProduct, (req, res) => {
         new CreateGenericProduct(req, res);
      });

      app.post(routes.deleteProduct, (req, res) => {
         new DeleteProduct(req, res);
      });

      app.post(routes.updateProduct, (req, res) => {
         new UpdateProduct(req, res);
      });

      app.get(routes.searchGeneric, (req, res) => {
         new GenericProductSearch(req, res);
      });

      app.get(routes.landingPage, (req, res) => {
         new LandingPage(req, res);
      });

      app.post(routes.createOrder, (req, res) => {
         new CreateOrder(req, res);
      });

      app.post(routes.cancelOrder, (req, res) => {
         new CancelOrder(req, res);
      });

      app.post(routes.getAdminRoles, (req, res) => {
         new GetRoles(req, res);
      });

      app.post(routes.getUsers, (req, res) => {
         new GetUsers(req, res);
      });

      app.post(routes.getUser, (req, res) => {
         new GetUser(req, res);
      });

      app.post(routes.deleteAccount, (req, res) => {
         new DeleteAccount(req, res);
      });

      app.post(routes.mapRoles, (req, res) => {
         new MapRoles(req, res);
      });

      app.get(routes.getAllRoles, (req, res) => {
         new GetAllRoles(req, res);
      });

      app.post(routes.createRole, (req, res) => {
         new CreateRole(req, res);
      });

      app.post(routes.createMarketLead, (req, res) => {
         new CreateMarketLead(req, res);
      });

      app.post(routes.editMarketLead, (req, res) => {
         new EditMarketLead(req, res);
      });

      app.post(routes.getMarketLead, (req, res) => {
         new GetMarketLead(req, res);
      });

      app.post(routes.deleteMarketLead, (req, res) => {
         new DeleteMarketLead(req, res);
      });

      app.post(routes.createVehicle, (req, res) => {
         new CreateVehicle(req, res);
      });

      app.post(routes.deleteVehicle, (req, res) => {
         new DeleteVehicle(req, res);
      });

      app.get(routes.getVehicleList, (req, res) => {
         new GetVehicleList(req, res);
      });

      app.post(routes.createStoreType, (req, res) => {
         new CreateStoreType(req, res);
      });

      app.get(routes.getStoreTypes, (req, res) => {
         new GetAllStoreTypes(req, res);
      });

      app.post(routes.deleteStoreType, (req, res) => {
         new DeleteStoreType(req, res);
      });

      app.post(routes.getContacts, (req, res) => {
         new GetContacts(req, res);
      });

      app.post(routes.available, (req, res) => {
         new Available(req, res);
      });

      app.post(routes.updateLocation, (req, res) => {
         new UpdateLocation(req, res);
      });

      app.post(routes.allOrders, (req, res) => {
         new AllOrders(req, res);
      });

      app.post(routes.allPendingOrders, (req, res) => {
         new PendingOrders(req, res);
      });

      app.post(routes.acceptOrder, (req, res) => {
         new AcceptOrder(req, res);
      });

      app.post(routes.declineOrder, (req, res) => {
         new DeclineOrder(req, res);
      });

      app.get(routes.landingPageCategory, (req, res) => {
         new LandingPageCategory(req, res);
      });

      app.post(routes.createBrandProduct, (req, res) => {
         new CreateBrandProduct(req, res);
      });

      app.post(routes.approveBrandProduct, (req, res) => {
         new ApproveBrandProduct(req, res);
      });

      app.post(routes.getBrandProduct, (req, res) => {
         new GetBrandProduct(req, res);
      });

      app.get(routes.getProductLanding, (req, res) => {
         new GetLandingProduct(req, res);
      });

      app.post(routes.getGenericProduct, (req, res) => {
         new GetGenericProduct(req, res);
      });

      app.post(routes.declineBrandProduct, (req, res) => {
         new DeclineBrandProduct(req, res);
      });

      app.post(routes.temp, (req, res) => {
         new Temp(req, res);
      });

      app.post(routes.acceptTask, (req, res) => {
         new AcceptTask(req, res);
      });


      app.post(routes.declineTask, (req, res) => {
         new DeclineTask(req, res);
      });

      app.post(routes.getRoutes, (req, res) => {
         new GetAllRoutes(req, res);
      });

      app.post(routes.getPendingTask, (req, res) => {
         new GetPendingTasks(req, res);
      });

      app.post(routes.getAllTask, (req, res) => {
         new GetAllTasks(req, res);
      });

      app.post(routes.pickUpStart, (req, res) => {
         new PickOffStart(req, res);
      });

      app.post(routes.pickUpEnd, (req, res) => {
         new PickOffEnd(req, res);
      });

      app.post(routes.dropOffStart, (req, res) => {
         new DropOffStart(req, res);
      });

      app.post(routes.dropOffEnd, (req, res) => {
         new DropOffEnd(req, res);
      });

      app.get(routes.getMainSettings, (req, res) => {
         new GetSettings(req, res);
      })

      app.post(routes.updateMainSettings, (req, res) => {
         new UpdateMainSettings(req, res);
      })

      app.post(routes.fareSettings, (req, res) => {
         new FareSettings(req, res);
      })

      app.get(routes.vehicleDelSettings, (req, res) => {
         new GetVehicleDeliveryCost(req, res);
      })

   }

   initExpressStart() {
      dotenv.config({
         path: path.join(__dirname, ".env")
      });

      const port = process.env.PORT || 9000;
      app.listen(port, () => console.log(`Listen on port ${port}...`));
   }
}

new SRServer();

//