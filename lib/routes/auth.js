const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const { HttpError } = require('../util/errors');


module.exports = router
    .post('/signup', (req, res, next) => {
        const { name, company, clearPassword } = req.body;
        Reviewer.create({ name, company, clearPassword })
            .then(result => res.json(result))
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { name, clearPassword } = req.body;

        Reviewer.findOne({ name }).then(reviewer => {

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
    });