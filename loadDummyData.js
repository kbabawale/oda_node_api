const category = require("./database/products/category");
const subcategory = require("./database/products/subcategory");
const uom = require("./database/products/uom");

uom.create({
   unit: "Packet",
   status: 1
});

uom.create({
   unit: "Dozen",
   status: 1
});

uom.create({
   unit: "Carton",
   status: 1
});

category
   .create({
      name: "Groceries"
   })
   .then(cat => {
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Food"
      });
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Toiletries"
      });
      subcategory.create({ categoryId: cat.dataValues.id, name: "Wine" });
   });

category
   .create({
      name: "Baby Products"
   })
   .then(cat => {
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Apparel and Accessories"
      });
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Diapery"
      });
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Baby and Toddler Toys"
      });
   });

category
   .create({
      name: "Health and Beauty"
   })
   .then(cat => {
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Hair care"
      });
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Fragrances"
      });
      subcategory.create({
         categoryId: cat.dataValues.id,
         name: "Makeup"
      });
   });
