const { getErrors } = require('./helpers');
const { dropCollection } = require('../e2e/db');
const Review = require('../../lib/models/Review');
const request = require('supertest');
const app = require('../../lib/app');

beforeEach(() => {
    return dropCollection('reviewers');
});
beforeEach(() => {
    return dropCollection('films');
});

let createdReviewers;
let createdFilms;

let films =  [{
    title: 'Bladecrawler',
    released: 1991,
    cast: [{
        role: 'lead',
    }]
},
{
    title: 'Bladewalker',
    released: 1992,
    cast: [{
        role: 'Deckard',
    }]
}];

let reviewers = [{
    name: 'Roger Ebert',
    company: 'Two Thumbs Up'
}, 
{
    name: 'Siskel Whatever',
    company: 'Two Thumbs Down'
}];
    

const createFilm = film => {
    return request(app)
        .post('/api/films')
        .send(film)
        .then(res => res.body);
};

const createReviewer = reviewer => {
    return request(app)
        .post('/api/reviewers')
        .send(reviewer)
        .then(res => res.body);
};
    
beforeEach(() => {
    return Promise.all(films.map(createFilm)).then(filmsRes => {
        createdFilms = filmsRes;
    });
});

beforeEach(() => {
    return Promise.all(reviewers.map(createReviewer)).then(reviewersRes => {
        createdReviewers = reviewersRes;
    });
});

// it.skip('returns the Review Schema Model', () => {
//     const data = {
//         rating: 4,
//         reviewer: createdReviewer[0]._id,
//         review: 'Eh, its ok.',
//         film: { createdFilm[0]._id,
//             createdAt: Date.now(),
//             updatedAt: Date.now()
//         }
//     };

//     const film = new Film(data);
//     const jsonFilm = film.toJSON();
//     expect(jsonFilm).toEqual(any.(Object));
// });