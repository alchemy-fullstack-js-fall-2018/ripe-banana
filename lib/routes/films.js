const router = require('express').Router();
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find()
            .select({ __v: false, cast: false })
            .populate({ 
                path: 'studio', select: 'name' 
            })
            .then(results => res.json(results))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const filmId = req.params.id;
        Promise.all([

            Review.find({ film: filmId })
                .select({ createdAt: false, updatedAt: false, __v: false, film: false })
                .populate({ path: 'reviewer', select: 'name' })
                .lean(),

            Film.findById(filmId)
                .select({ __v: false, _id: false })
                .populate({
                    path: 'studio', 
                    select: 'name'
                })
                .populate({
                    path: 'cast.actor',
                    select: 'name' 
                })
        ])
            .then(([reviews, film]) => {
                const toReturn = {
                    title: film.title,
                    studio: film.studio,
                    released: film.released,
                    cast: film.cast,
                    reviews
                };
                res.json(toReturn);
            });
    });
