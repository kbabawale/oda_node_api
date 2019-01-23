let jwt = require("jsonwebtoken");

const validateToken = token => {
   try {
      let decoded = jwt.verify(token, process.env.SECRETKEY);
      return decoded;
   } catch (err) {
      return false;
   }
};

module.exports = validateToken;