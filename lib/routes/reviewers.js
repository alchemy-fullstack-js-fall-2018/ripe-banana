const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

module.exports = router
    .post('/', (req, res) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company }).then(reviewer => 
            res.json(reviewer)
        );
    });
