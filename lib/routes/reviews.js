const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res) => {
        const { rating, reviewer, review, film } = req.body;
        
        Review.create({ rating, reviewer, review, film })
            .then(review => res.json(review));
    })
    
    .get('/', (req, res) => {
        Review.find()
            .populate({ path: 'film', select: 'title' })
            .select({ rating: true, review: true, film: true, created_at: true, updated_at: true })
            .sort({ created_at: -1 })
            .limit(100)
            .then(reviews => res.json(reviews));
    });
