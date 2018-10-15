const router = require('express').Router();
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast } = req.body;
        // const [role, actor] = cast;
        Film.create({ title, studio, released, cast })
            .then(result => res.json(result));
    });
