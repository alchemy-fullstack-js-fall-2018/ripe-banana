const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');



module.exports = router
    .post('/', (req, res, next) => {
        console.log('body', req.body)
        const { name, company, email, role, password} = req.body;
        Reviewer.create({ name, company, email, role, password })
            .then(reviewer => res.json(reviewer));
    })

    .get('/', (req, res) => {
        Reviewer.find()
            .select({ __v: false })
            .then(reviewers => res.json(reviewers));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Reviewer.findById(id).select({ __v: false }).lean(),
            Review.find().where('reviewer').equals(id).select({
                rating: true,
                review: true,
                film: true
            })
                .populate({ path: 'film', select: 'title' })
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Reviewer.findByIdAndDelete(id).then(reviewer => res.json({ removed: !!reviewer }));
    })
    
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.findByIdAndUpdate(id, { name, company }, { new: true })
            .then(reviewer => res.json(reviewer));
            
    });

