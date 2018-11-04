const router = require('express').Router();
const Review = require('../models/Review');
const ensureAuth = require('../util/ensure-auth');

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        const { rating, reviewer, text, film } = req.body;
        Review.create({ rating, reviewer, text, film })
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .limit(100)
            .select({ 
                __v: false, 
                createdAt: false, 
                updatedAt: false,
                reviewer: false,
                email: false,
                roles: false
            })
            .populate({ path: 'film', select: 'title' })
            .then(results => res.json(results))
            .catch(next);
    });

