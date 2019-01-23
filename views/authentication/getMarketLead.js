const ResponseObj = require("../../utilities/responsehandler");
let MarketLead = require("../../database/authentication/marketLeads");

class GetMarketLead{
    constructor(req, res) {
        this.data = req.body;
        this.res = res;
        this.getThem();
    }
    getThem() {

        const {refererCode} = this.data;

        //if market lead id provided, get one its details
        if(refererCode != ""){
            MarketLead.findOne({ where: {refererCode:refererCode}}).then(marketlead => {
                if(marketlead.length != 0){
                    let responseData = JSON.stringify({
                        marketlead: marketlead
                    });
                    return ResponseObj.responseHandlers(200, this.res, responseData);
                }
            });
        }else{
            //else get all of them
            MarketLead.findAll({}).then(marketleads => {
                let responseData = JSON.stringify({
                    marketlead: marketleads
                });
                return ResponseObj.responseHandlers(200, this.res, responseData);
            });
        }
        
    }
}

module.exports = GetMarketLead;