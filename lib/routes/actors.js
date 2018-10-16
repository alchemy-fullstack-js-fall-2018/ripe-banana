const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');


module.exports = router
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob })
            .then(actor => res.json(actor));
    })

    .get('/', (req, res) => {
        Actor.find()
            .select({ name: true })
            .then(actors => res.json(actors));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Actor.findById(id).select({ __v: false, _id: false }).lean(),
            Film.find().where('cast.actor').equals(id).select({ title: true, released: true })
        ])
            .then(([actor, films]) => {
                actor.films = films;
                res.json(actor);
            });
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Actor.findByIdAndDelete(id).then(actor => res.json({ removed: !!actor }));
    })
    
    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, dob, pob } = req.body;
        Actor.findByIdAndUpdate(id, { name, dob, pob }, { new: true })
            .then(actor => res.json(actor));
    });
