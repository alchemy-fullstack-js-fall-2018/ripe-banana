const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = router 

    .post('/', (req, res, next) => {
        const { name, company, email, roles, clearPassword } = req.body;
        Reviewer.create({ name, company, email, roles, clearPassword })
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const reviewerId = req.params.id;
        Promise.all([
            Reviewer.findById(reviewerId).select({ __v: false, passwordHash: false }).lean(),                
            Review.find({ reviewer: reviewerId })
                .select({ __v: false, updatedAt: false, createdAt: false, reviewer: false })
                .populate({
                    path: 'film', select: 'title'
                })
                .lean()
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.findByIdAndUpdate(id, { name, company }, { new: true })
            .then(result => res.json(result))
            .catch(next);
    });


