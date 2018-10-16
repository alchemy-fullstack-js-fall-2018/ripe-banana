const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createStudios, createActors, createReviewers } = require('./helpers');

describe('reviews', () => {

    let createdStudios;
    let createdActors;
    let createdReviewers;

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    beforeEach(() => {
        return Promise.all([
            dropCollection('reviewers'),
            dropCollection('studios'),
            dropCollection('actors')
        ]);
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
            });
    });
       
    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });
    
    beforeEach(() => {
        return createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
    });

    beforeEach(() => {
        let films = [
            {
                title: 'The Programinator',
                studio: createdStudios[0]._id,
                released: 1984,
                cast: [
                    { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                    { role: 'Sidekick', actor: createdActors[1]._id }
                ]
            },
            {
                title: 'Thelma and Luigi',
                studio: createdStudios[0]._id,
                released: 1972,
                cast: [
                    { role: 'Thelma', actor: createdActors[1]._id }, 
                    { role: 'Luigi', actor: createdActors[0]._id }
                ]
            }
        ];
    
        return Promise.all(films.map(createFilm))
            .then(filmsRes => { createdFilms = filmsRes;});
    });

    it('creates a review', () => {

    });
});
