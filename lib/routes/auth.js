const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth');



module.exports = router
    .post('/signup', (req, res, next) => {
        const { email, name, company, roles, clearPassword } = req.body;
        Reviewer.create({ email, name, company, roles, clearPassword })
            .then(result => res.json(result))
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, clearPassword } = req.body;

        Reviewer.findOne({ email }).then(reviewer => {

            const correctPassword = reviewer && reviewer.compare(clearPassword);

            if(correctPassword) {
                const token = reviewer.authToken();
                res.json({ token });

            } else {
                next(new HttpError({
                    code: 401,
                    message: 'Bad email or password'
                }));
            }
        });

    })

    .get('/verify', ensureAuth, (req, res, next) => {
        res.json({ success: !!req.user });
    });