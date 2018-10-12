const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router
    .post('/', (req, res) => {
        const { name, address } = req.body;
        Studio.create({ name, address })
            .then(studio => res.json(studio))
    });





// ##### `GET /studios`

// ```
// [{ _id, name }]
// ```

// ##### `GET /studios/:id`

// ```
// { _id, name, address, films: [{ _id, title }] }
// ```
//delete, post, get


