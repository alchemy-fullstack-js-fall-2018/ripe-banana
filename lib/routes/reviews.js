const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res, next) => {
        const { rating, reviewer, text, film } = req.body;
        Review.create({ rating, reviewer, text, film })
            .then(result => res.json(result))
            .catch(next);
    });

