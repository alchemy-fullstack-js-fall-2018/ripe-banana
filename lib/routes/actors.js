const router = require('express').Router();
const Actor = require('../models/Actor');

module.exports = router
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob })
            .then(actor => res.json(actor));
    })

    .get('/', (req, res) => {
        Actor.find()
            .select({ name: true })
            .then(actors => res.json(actors));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Actor.findById(id).then(actor => res.json(actor));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Actor.findByIdAndDelete(id).then(actor => res.json({ removed: !!actor }));
    })
    
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, dob, pob } = req.body;
        Actor.findByIdAndUpdate(id, { name, dob, pob }, { new: true })
            .then(actor => res.json(actor));
    });
