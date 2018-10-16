const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

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
        Promise.all([
            Studio.findById(id).select({ __v: false }).lean(),
            Film.find().where('studio').equals(id).select({ title: true })
        ])
            .then(([studio, films]) => {
                studio.films = films;
                res.json(studio);
            });
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Film.find({ 'studio': id })
            .then(film => {
                if(film.length === 0) {
                    Studio.findByIdAndDelete(id).then(studio => res.json({ removed: !!studio }));
                }
                else {
                    res.json({ Error: 'Cannot remove a studio referenced in a film' });
                }
            });
    })
    
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, address } = req.body;
        Studio.findByIdAndUpdate(id, { name, address }, { new: true })
            .then(studio => res.json(studio));
    });
