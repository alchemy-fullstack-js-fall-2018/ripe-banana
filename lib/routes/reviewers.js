const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');



module.exports = router
    .post('/', (req, res) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company }).then(reviewer => 
            res.json(reviewer)
        );
    })
    .get('/', (req, res) => {
        Reviewer.find().then(reviewer => res.json(reviewer));
    })
    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Reviewer.findById(id).lean(),
            Review.find().where('reviewer').equals(id).select({ rating: true, review: true, film: true })
                .populate({ 
                    path: 'film',
                    select: 'title' 
                })
                .lean(),
            
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            });
    })
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const name = req.body;
        Reviewer.findByIdAndUpdate(id, name, { new: true }).then(reviewer => res.json(reviewer));
    });
    
    
