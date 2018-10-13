const router = require('express').Router();
const Studio = require('../models/Studio');

module.exports = router
    .post('/', (req, res) => {
        const { name, address } = req.body;
        Studio.create({ name, address })
            .then(studio => res.json(studio));
    })

    .get('/', (req, res) => {
        Studio.find().then(studios => res.json(studios));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Studio.findById(id).then(studio => res.json(studio));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Studio.findByIdAndDelete(id).then(studio => res.json({ removed: !!studio }));
    })
    
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, address } = req.body;
        Studio.findByIdAndUpdate(id, { name, address }, { new: true })
            .then(studio => res.json(studio));
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


