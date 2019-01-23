let DeliverRepLocation = require("../database/deliveryRep/location");
let geolib = require("geolib");

const RANGE = 0.09;

const match = (destLat, destLong) => {
   const [upperLongitude, lowerLongitude] = [
      parseFloat(destLong) + RANGE,
      parseFloat(destLong) - RANGE
   ];
   const [upperLatitude, lowerLatitude] = [
      parseFloat(destLat) + RANGE,
      parseFloat(destLat) - RANGE
   ];

   DeliverRepLocation.findAll({
      where: {
         longitude: { $between: [lowerLongitude, upperLongitude] },
         $and: { latitude: { $between: [lowerLatitude, upperLatitude] } }
      }
   }).then(deliveryReps => {
      if (deliveryReps.length == 0) {
         return null; // No delivery rep found
      }
      let current = { lat: destLat, lng: destLong };
      const coords = deliveryReps.map(rep => {
         return {
            lat: rep.dataValues.latitude,
            lng: rep.dataValues.longitude
         };
      });
      let distFromCurrent = function(coord) {
         return { coord: coord, dist: geolib.getDistance(current, coord) };
      };

      let closest = coords.map(distFromCurrent).sort(function(a, b) {
         return a.dist - b.dist;
      })[0];

      DeliveryRepLocation.findOne({
         where: {
            latitude: closest.coord.lat,
            longitude: closest.coord.lng
         }
      }).then(selectedRep => {
         return selectedRep;
      });
   });
};
module.exports = match;

// They said I should do what just works.
// Ask the Project Manager.
