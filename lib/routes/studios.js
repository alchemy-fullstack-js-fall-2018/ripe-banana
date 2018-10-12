const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router
    .post('/', (req, res) => {
        const { name, address } = req.body;
        Studio.create({ name, address }).then(studio => 
            res.json(studio)
        );
    })

    .get('/', (req, res) => {
        Studio.find()
            .select({ name: true })
            .lean()
            .then(studio => res.json(studio));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Studio
            .findById(id)
            .lean()
            .then(studio => res.json(studio));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Studio.findByIdAndRemove(id).then(result => {
            return { removed: !!result };
        })
            .then(result => res.json(result));
    });


