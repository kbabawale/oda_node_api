class responseHandler {
   constructor() {}

   static responseHandlers(statuscode, res, data) {
      this.statuscode = statuscode;
      this.res = res;
      this.data = data;

      this.res.writeHeader(this.statuscode, {
         "Content-Type": "application/json"
      });
      if (this.data) this.res.write(this.data);
      this.res.end();
   }
}

module.exports = responseHandler;
