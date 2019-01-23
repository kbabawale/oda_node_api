let Store = require("../database/store/store");
let Product = require("../database/products/storeProduct");

const RANGE = 0.09;

const match = (productUid, storeUid) => {
   Product.findOne({ where: { uid: productUid } }).then(product => {
      if (product == null) {
         console.log("Hmmm, I no fit talk");
      }

      const [upperLongitude, lowerLongitude] = [
         parseFloat(product.dataValues.longitude) + RANGE,
         parseFloat(product.dataValues.longitude) - RANGE
      ];
      const [upperLatitude, lowerLatitude] = [
         parseFloat(product.dataValues.latitude) + RANGE,
         parseFloat(product.dataValues.latitude) - RANGE
      ];

      // Find products based on location

      Product.findOne({
         where: {
            storeUid: { $not: storeUid },
            genericUid: product.dataValues.genericUid,
            longitude: { $between: [lowerLongitude, upperLongitude] },
            $and: {
               latitude: { $between: [lowerLatitude, upperLatitude] }
            },
            order: "random()"
         }
      }).then(newproduct => {
         if (newproduct == null) {
            return null; // Product is not available
         }
         Store.findOne({ where: { uid: newproduct.dataValues.storeUid } }).then(
            store => {
               return { store: store, product: newproduct };
            }
         );
      });
   });
};

module.exports = match;
