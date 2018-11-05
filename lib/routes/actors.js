const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob })
            .then(actor => {
                res.json(actor);
            });
    })

    .get('/', (req, res) => {
        Actor.find().then(actors => {
            res.json(actors);
        });
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Actor.findById(id)
                .lean(),
            Film.find().where('cast.actor')
                .equals(id)
                .lean()
                .select(['title', 'released']) 
        ])
            .then(([actor, films]) => {
                actor.films = films;
                res.json(actor);
            });
    });
