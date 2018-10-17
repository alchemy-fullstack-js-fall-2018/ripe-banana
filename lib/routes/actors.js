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
        Actor.find().then(result => res.json(result));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Promise.all([
            Actor.findById(id)
                .select({ __v: false, _id: false })
                .lean(),
            Film.find({ 'cast.actor': id })
                .select({ _id: true, title: true, released: true })
                .lean()
        ])
            .then(([actor, films]) => {
                actor.films = films;
                res.json(actor);
            });
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Actor.findByIdAndDelete(id)
            .then(deletedActor => {
                res.json({ removed: !!deletedActor });
            });
    })

    .put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, dob, pob } = req.body;
        Actor.findByIdAndUpdate(id, { name, dob, pob }, { new: true })
            .then(result => res.json(result));
    });

    


    
