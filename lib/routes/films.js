const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => res.json(film));
    })

    .get('/', (req, res) => {
        Film.find()
            .populate({ path: 'studio', select: 'name' })
            .select({ title: true, released: true, studio: true })
            .then(films => res.json(films));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Film.findById(id)
            .populate({ path: 'studio', select: 'name' })
            .populate({ path: 'cast.actor', select: 'name' })
            .select({ _id: false, title: true, released: true, studio: true, cast: true })
            .then(film => res.json(film));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Film.findByIdAndDelete(id).then(film => res.json({ removed: !!film }));
    });

