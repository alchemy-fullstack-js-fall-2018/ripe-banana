const Reviewer = require('../models/Reviewer');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {

    const token = req.token;
    console.log ('token', token);

    if(!token) {
        next(new HttpError({
            code: 401,
            message: 'Sign-in required'
        }));
        return;
    }
    
    console.log('about to findByToken', token);

    Reviewer.findByToken(token).then(user => {
        if(user) {
            req.user = user;
            console.log('found user', user);
            next();
        } else {
            console.log('could not find user');
            next(new HttpError({
                code: 401,
                message: 'Incorrect email or password'
            }));
        }
    });

};
