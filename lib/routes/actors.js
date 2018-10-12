const router = require('express').Router();
const Actor = require('../models/Actor');

module.exports = router 
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob })
            .then(actor => res.json(actor));
    });