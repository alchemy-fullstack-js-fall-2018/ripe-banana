const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => res.json(film));
    })

    .get('/', (req, res) => {
        Film.find().then(films => res.json(films));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Film.findById(id).then(film => res.json(film));
    });
    


// ##### `GET /films`

// ```
// [{ 
//     _id, title, released, 
//     studio: { _id, name } 
// }]
// ```

// ##### `GET /films/:id`

// ```
// {   
//     title, released, 
//     studio: { _id, name }, 
//     cast: [{ 
//         _id, role, 
//         actor: { _id, name }
//     }], 
//     reviews: [{ 
//         id, rating, review, 
//         reviewer: { _id, name }
//     ]
// }
//delete, post, get, post

