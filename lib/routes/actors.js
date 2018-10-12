const router = require('express').Router();
const Actor = require('../models/Actor');

module.exports = router
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob }).then(actor => 
            res.json(actor)
        );
    })

    .get('/', (req, res) => {
        Actor.find()
            .select({ name: true })
            .lean()
            .then(actor => res.json(actor));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Actor
            .findById(id)
            .lean()
            .then(actor => res.json(actor));
    })

    .put('/:id', (req, res) => {
        const { id } = req.params;
        const name = req.body;
        Actor.findByIdAndUpdate(id, name, { new: true }).then(actor =>
            res.json(actor)
        );
    });
