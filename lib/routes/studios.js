const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router
    .post('/', (req, res) => {
        const { name, address } = req.body;
        const { city, state, country } = address;
        Studio.create({ name, address: { city, state, country } })
            .then(studio => {
                res.json(studio);
            });
    })

    .get('/', (req, res) => {
        Studio.find().then(studios => res.json(studios));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Studio.findById(id)
            .then(studio => res.json(studio));
    })


