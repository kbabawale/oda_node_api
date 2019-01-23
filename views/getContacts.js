const ResponseObj = require("../utilities/responsehandler");
const Contact = require("../database/contacts/contacts");

class GetContact {
   constructor(data, res) {
      this.data = data.body;
      this.res = res;
      this.getContact();
   }

   getContact() {
      const { userId, contacts } = this.data;
      contacts.map(contact => {
         Contact.create({
            userUid: userId,
            mobile: contact.mobile,
            email: contact.email,
            name: contact.name
         }).catch(err => {});
      });
      let responseData = JSON.stringify({
         statusMsg: "Done."
      });
      return ResponseObj.responseHandlers(200, this.res, responseData);
   }
}

module.exports = GetContact;
