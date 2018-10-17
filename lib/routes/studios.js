const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

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
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        
        Promise.all([
            Studio.findById(id).lean(),
            Film.find().where('studio').equals(id).lean()
        ])
            .then(([studio, films]) => {
                studio.films = films;
                res.json(studio);
            });
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Film.find({ studio: id })
            .then(film => {
                if(film.length === 0) {
                    Studio.findByIdAndRemove(id).then(result => {
                        return { removed: !!result };
                    })
                        .then(result => res.json(result));
                }
                else {
                    res.json({ removed: false });
                }

            });
    });


