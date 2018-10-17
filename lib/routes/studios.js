const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = router 
    .post('/', (req, res) => {
        const { name, address } = req.body;
        const { city, state, country } = address;
        Studio.create({ name, address: { city, state, country } })
            .then(studio => res.json(studio));
    })

    .get('/', (req, res) => {
        Studio.find()
            .then(studios => res.json(studios));
    })

    .get('/:id', (req, res) => {
        const studioId = req.params.id;

        Promise.all([
            Studio.findById(studioId),
            Film.find({ studio: studioId })
                .select({ _id: true, title: true })
        ])
            .then(([studio, films]) => {
                const toReturn = {
                    _id: studio._id,
                    name: studio.name,
                    address: studio.address,
                    films: films
                };
                res.json(toReturn);
            }); 
    })

    .delete('/:id', (req, res) => {
        const studioId  = req.params.id;
        Film.find({ studio: studioId })
            .then(films => {
                if(films.length === 0) {
                    Studio.findByIdAndDelete(studioId)
                        .then(deletedStudio => {
                            res.json({ removed: !!deletedStudio });
                        });
                } else {
                    res.json({ removed: false });
                }
            });
    });
