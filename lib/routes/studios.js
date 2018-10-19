const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

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

        Promise.all([
            Studio.findById(id)
                .lean(),
            Film.find({ studio: id })
                .lean()
                .select('title')
        ])
            .then(([studio, films]) => {
                studio.films = films;
                res.json(studio);
            });
    })

//TODO: DELETE STUDIO. CAN'T DELETE STUDIO IF THERE ARE FILMS


