const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

module.exports = router 

    .post('/', (req, res, next) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company })
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Reviewer.findById(id)
            .then(result => res.json(result))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.findByIdAndUpdate(id, { name, company }, { new: true } )
            .then(result => res.json(result))
            .catch(next);
    });


