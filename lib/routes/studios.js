const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router
    .post('/', (req, res) => {
        const { name, address } = req.body;
        Studio.create({ name, address }).then(studio => 
            res.json(studio)
        );
    })

    .get('/', (req, res) => {
        Studio.find()
            .select({ name: true })
            .lean()
            .then(studio => res.json(studio));
    });
