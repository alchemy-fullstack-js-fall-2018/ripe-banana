const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast }).then(film => 
            res.json(film)
        );
    })
    .get('/', (req, res) => {
        Film.find()
            .select({ _id: true, title: true, released: true, studio: true })
            .populate({ path: 'studio', select: 'name' })
            .lean()
            .then(films => res.json(films));
    })
    .get('/:id', (req, res) => {
        const { id } = req.params;
        Film.findById(id)
            .select({ title: true, released: true, studio: true, cast: true })
            .populate({ path: 'studio', select: 'name' })
            .populate({ path: 'cast.actor', select: 'name' })
            .lean()
            .then(film => res.json(film));
    })
    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Film.findByIdAndRemove(id).then(result => {
            return { removed: !! result };
        })
            .then(result => res.json(result));
    });
