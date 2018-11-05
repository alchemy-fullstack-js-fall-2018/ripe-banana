const router = require('express').Router();
const User = require('../models/User');
const { HttpError } = require('../util/errors');
const verifyAuth = require('../util/verify-auth');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { name, email, company, role, clearPassword } = req.body;
        User.create({
            name,
            email,
            company,
            role,
            clearPassword
        }).then(user => {
            res.json(user)
                .catch(next);
        });
    })

    .post('/signin', (req, res, next) => {
        const { email, clearPassword } = req.body;
        User.findOne({ email }).then(user => {
            // user === null
            const correctPassword = user && user.compare(clearPassword);
            if(correctPassword) {
                // should send token back
                const token = user.authToken();
                res.json({ token });
            } else {
                next(new HttpError({
                    code: 401,
                    message: 'Bad email or password'
                }));
            }
        });
    })

    .get('/verify', verifyAuth, (req, res, next) => {
        res.json({ success: !!req.user })
            .catch(next);   
    });
