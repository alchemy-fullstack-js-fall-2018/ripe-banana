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
    });
