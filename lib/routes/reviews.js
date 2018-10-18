const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router 
    .post('/', (req, res) => {
        const { rating, reviewer, review, film } = req.body;
        Review.create({ rating, reviewer, review, film })
            .then(review => {
                res.json(review)
            })
    })