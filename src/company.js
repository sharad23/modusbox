const mysql = require("./mysql");
const utils = require("./utils");
const market = require("./market");
const validators = require("./validators");

async function create(data) {
    validators.validate(data, validators.COMPANY_SCHEMA)
    
    const { symbol } = data
    // check wether the symbol is already present
    const mysqlPromise = mysql.query(`SELECT id FROM company WHERE symbol = ?`, [symbol])
    // check the market api
    const marketApiPromise = await market.getCompanyProfile(symbol);
    const [[company], ...etc] = await Promise.all([mysqlPromise, marketApiPromise]);
    if (company) {
        throw utils.httpError(400, `${symbol} is already present`)
    }
    
    // insert into company
    await mysql.query(`INSERT INTO company (symbol) VALUES (?)`, [symbol]) 
    return {message: `Successfully inserted ${symbol}`}
} 

async function remove(id){
    await mysql.query(`DELETE FROM company WHERE id=?`, [id])
    return {message: `Successfully deleted`}
}

async function get(){
    const result = await mysql.query(`SELECT id, symbol FROM company`)
    return result
}

async function details(id) {
    const [ result ]  = await mysql.query(`SELECT symbol FROM company WHERE id = ?`, [id])
    if (!result) {
        throw utils.httpError(404, `${id} not found`)
    }
    // call market api
    const company = await market.getCompanyProfile(result.symbol);
    return company

}

module.exports = {
    create,
    remove,
    get,
    details
}