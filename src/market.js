const axios = require("axios");
const config = require("./config");
const logger = require("lib-logger");
const utils = require("./utils");
const API_KEY = {
    access_key: config.marketPlace.key
}

async function getCompanyProfile(symbol) {
    try {
        const { data } = await axios.get(`${config.marketPlace.domain}tickers/${symbol}`, {params: API_KEY})
        return data
    } catch(err) {
        logger.error(`Failed response from MARKET API due to ${err.message} `)
        throw utils.httpError(400, `${symbol} doesn't exists in stock market`);
    }
}

async function getLatest(symbol) {
    try {
        API_KEY.symbols = symbol
        const { data } = await axios.get(`${config.marketPlace.domain}intraday/latest`, {params: API_KEY})
        return data
    } catch(err) {
        logger.error(`Failed response from MARKET API due to ${err.message} `)
        throw utils.httpError(500)
    }
}

async function getHistory(symbol, date_from, date_to) {
    try {
        const { data } = await axios.get(`${config.marketPlace.domain}eod`, {params: {symbols:symbol, date_from, date_to,...API_KEY }})
        return data
    } catch(err) {
        logger.error(`Failed response from MARKET API due to ${err.message} `)
        throw utils.httpError(500)
    }
}

async function pingApi() {
    await axios.get(`${config.marketPlace.domain}tickers`, {params: API_KEY})
    logger.info(`The Market Api are successfully running`)
}

module.exports = {
    getCompanyProfile,
    getLatest,
    getHistory,
    pingApi
}