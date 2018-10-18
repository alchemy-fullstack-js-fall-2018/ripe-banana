const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router

    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => {
                res.json(film);
            });
    })

    .get('/', (req, res) => {
        Film.find().then(films => {
            res.json(films);
        });
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Film.findById(id)
            .populate({ path:'studio', select: 'name' })
            .then(actor => res.json(actor));
            
    })