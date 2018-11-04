const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { name, dob, pob } = req.body;
        Actor.create({ name, dob, pob }).then(actor => 
            res.json(actor)
        );
    })

    .get('/', (req, res) => {
        Actor.find()
            .select({ name: true })
            .lean()
            .then(actor => res.json(actor));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;

        Promise.all([
            Actor.findById(id).lean(),
            Film.find().where('cast.actor').equals(id).select({ title: true, released: true }).lean()
        ])
            .then(([actor, films]) => {
                actor.films = films;
                res.json(actor);
            });
    })

    .put('/:id', (req, res) => {
        const { id } = req.params;
        const name = req.body;
        Actor.findByIdAndUpdate(id, name, { new: true }).then(actor =>
            res.json(actor)
        );
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Actor.findByIdAndRemove(id).then(result => {
            return { removed: !!result };
        })
            .then(result => res.json(result));
    });
