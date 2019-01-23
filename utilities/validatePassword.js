const bcrypt = require("bcrypt");

let validatePassword = (password, hash) => {
   return bcrypt.compareSync(password, hash);
};

module.exports = validatePassword;
