const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { name, company, email, roles, clearPassword } = req.body;
        Reviewer.create({ name, company, email, roles, clearPassword })
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });


