const router = require('express').Router();
const Film = require('../models/Film');
const Review = require('../models/Review');

module.exports = router

    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => {
                res.json(film);
            });
    })

    .get('/', (req, res) => {
        Film.find()
            .populate({ path: 'studio', select: 'name' })
            .then(films => {
                res.json(films);
            });
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Film.findById(id)
                .lean()
                .populate({ path:'studio', select: 'name' })
                .populate({ path: 'cast.actor', select: 'name' }),
            Review.find({ film: id })
                .lean()
                .select(['rating', 'review', 'reviewer'])
        ])
            .then(([film, reviews]) => {
                film.reviews = reviews;
                res.json(film);
            });      
    })
