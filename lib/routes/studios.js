const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router 
    .post('/', (req, res) => {
        console.log(req.body);
        const { name, address } = req.body;
        const { city, state, country } = address;
        Studio.create({ name, address: { city, state, country } })
            .then(studio => res.json(studio));
    });
