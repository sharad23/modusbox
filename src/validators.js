const Joi = require('joi');
const _ = require('lodash');
const utils = require('./utils');

const COMPANY_SCHEMA = Joi.object().keys({ 
    symbol: Joi.string().required()
});

function validate(data, schema, options = { allowUnknown: false }){
    const { result, error } = Joi.validate(data, schema, options);
    if (error) {
        const message = _.get(error, 'details[0].message', error.message);
        console.log(message)
        throw utils.httpError(400, message)
    }

    return result
}

module.exports = {
    validate,
    COMPANY_SCHEMA
}