const Reviewer = require('../models/Reviewer');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {

    const token = req.token;
    if(!token) {
        next(new HttpError({
            code: 401,
            message: 'Incorrect email or password'
        }));
        return; // necessary?
    }

    Reviewer.findByToken(token).then(user => {
        if(user) {
            req.user = user;
            next();
        } else {
            next(new HttpError({
                code: 401,
                message: 'Incorrect email or password'
            }));
        }
    });

};
