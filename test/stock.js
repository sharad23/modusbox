const assert = require('assert');
const proxyquire = require('proxyquire');

const market = {
    getLatest: (symbol) => {
        return {
            data: [
                {
                    "open": 3208.16,
                    "high": 3214.08,
                    "low": 3185.18,
                    "date": "2021-06-03T18:00:00+0000",
                    "symbol": symbol
                }
            ]
        }
    },
    getHistory: (symbol, fromDate, toDate) =>{
        return {
            data:[
                {
                    "open": 3223.1001,
                    "high": 3235,
                    "low": 3208,
                    "symbol": symbol,
                    "date": "2021-06-02T00:00:00+0000"
                }
            ]
        }
    }

}

const stocks = proxyquire('../src/stock', {
    './market': market,
});

describe('market', () => { 
    it('should get the lastest ticker', async() => {
        const { symbol } = await stocks.tickers("ASN");
        assert.strictEqual(symbol, "ASN")
    });

    it('should get the history of the ticket', async() => {
        const [ data ] = await stocks.history("ASN");
        assert.strictEqual(data.symbol, "ASN")
    });
});