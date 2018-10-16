const router = require('express').Router();
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');


module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast } = req.body;
        // const [role, actor] = cast;
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
        Review.find({ film: filmId })
            .then(reviewResults => {
                console.log('UUUUUUU', reviewResults);
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
                    // .populate({
                    //     path: 'reviews', 
                    // })
                    .then(result => {
                        result.reviews = reviewResults;
                        res.json(result);
                    });
            })
    })
