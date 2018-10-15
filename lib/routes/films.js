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
    


