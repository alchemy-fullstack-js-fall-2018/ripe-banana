const Reviewer = require('../models/Reviewer');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {
    // ensure that a token is passed
    // ensure that the token contains a reviewer
    // Bearer OUR_TOKEN_HERE
    const token = req.token;
    if(!token) {
        next(new HttpError({
            code: 401,
            message: 'Incorrect email or password'
        }));
        return;
    }

    Reviewer.findByToken(token).then(reviewer => {
        if(reviewer) {
            req.reviewer = reviewer;
            next();
        } else {
            next(new HttpError({
                code: 401,
                message: 'Incorrect email or password'
            }));
        }
    });
};
