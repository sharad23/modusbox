const assert = require('assert');
const proxyquire = require('proxyquire');

const mysql = {
    query: (sql, params) => {
        return []
    }
}

const market = {
    getCompanyProfile: (symbol) => {
        return {}
    }
}

const company = proxyquire('../src/company', {
    './market': market,
    './mysql': mysql
});

describe('company', () => {
    it('should create the company', async() => {
        const result = await company.create({symbol: "ASN"});
        assert.strictEqual(result.message, "Successfully inserted ASN")
    });

    it('should delete the company', async() => {
        const result = await company.remove(1);
        assert.strictEqual(result.message, "Successfully deleted")
    });

}); 