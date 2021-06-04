const market = require("./market");
const moment = require("moment");

async function tickers(symbol) {
    const { data }  = await market.getLatest(symbol)
    return data[0]
}

async function history(symbol, fromDate, toDate){
    fromDate = moment(fromDate).isValid() ? fromDate : moment().subtract(5, "days").format("YYYY-MM-DD")
    toDate = moment(toDate).isValid() ? toDate : moment().format('YYYY-MM-DD')
    const { data } = await market.getHistory(symbol, fromDate, toDate)
    return data
}

module.exports = {
    tickers,
    history
}