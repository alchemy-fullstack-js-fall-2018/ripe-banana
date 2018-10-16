const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

module.exports = router
    .post('/', (req, res) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company })
            .then(reviewer => res.json(reviewer));
    })

    .get('/', (req, res) => {
        Reviewer.find()
            .select({ __v: false })
            .then(reviewers => res.json(reviewers));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Reviewer.findById(id).then(reviewer => res.json(reviewer));
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

