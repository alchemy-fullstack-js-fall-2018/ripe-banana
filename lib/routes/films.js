const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => res.json(film));
    })

    .get('/', (req, res) => {
        Film.find().then(films => res.json(films));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Film.findById(id).then(film => res.json(film));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Film.findByIdAndDelete(id).then(film => res.json({ removed: !!film }));
    })

    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { title, studio, released, cast } = req.body;
        Film.findByIdAndUpdate(id, { title, studio, released, cast }, { new: true })
            .then(film => res.json(film));
    });
