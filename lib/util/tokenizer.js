const { sign, verify } = require('jsonwebtoken');
const APP_SECRET = 'whatever_password';

const tokenize = payload => {
    return sign({ payload }, APP_SECRET, { expiresIn: '24hr' });
};

module.exports = {
    tokenize
};
