const app = require('../../lib/app');
const request = require('supertest');
const { dropCollection } = require('./db');
const { createActors, createStudios, createReviewers } = require('./helpers');

describe('film routes', () => {

    let createdFilms;
    let createdStudios;
    let createdActors;
    let createdFilms;
    let createdReviewers;
    
    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    const createReview = review => {
        return request(app)
            .post('/reviews')
            .send(review)
            .then(res => res.body);
    };

    beforeEach(() => {
        return Promise.all([
            dropCollection('studios'),
            dropCollection('actors'),
            dropCollection('films')
        ]);
    });
    
    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
            });
    });

    beforeEach(() => {
        return createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
    });

    beforeEach(() => {
        let reviews = [
            {
                rating: 5,
                reviewer: createdReviewers[0]._id,
                text: 'Amazeballs!',
                film: createdFilms[0]._id 
            },
            {
                rating: 1,
                reviewer: createdReviewers[1]._id,
                text: 'I want the last 1.5 hours of my life back.',
                film: createdFilms[1]._id 
            }
        ];

        return Promise.all(reviews.map(createReview))
            .then(reviewsRes => { createdReviews = reviewsRes;});

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
    
    it('creates a film', () => {
        const newFilm = {
            title: 'Revenge of the Programmers',
            studio: createdStudios[0]._id,
            released: 1985,
            cast: [
                { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                { role: 'Sidekick', actor: createdActors[1]._id }
            ]
        };
        return request(app)
            .post('/films')
            .send(newFilm)
            .then(result => {
                expect(result.body).toEqual({
                    title: 'Revenge of the Programmers',
                    studio: createdStudios[0]._id,
                    released: 1985,
                    cast: [
                        { _id: expect.any(String), role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                        { _id: expect.any(String), role: 'Sidekick', actor: createdActors[1]._id }
                    ],
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('gets all films', () => {
        return request(app)
            .get('/films')
            .then(retrievedFilms => {
                createdFilms.forEach(createdFilm => {
                    expect(retrievedFilms.body).toContainEqual(
                        {
                            title: createdFilm.title,
                            released: createdFilm.released,
                            studio: { 
                                _id: createdStudios[0]._id,
                                name: createdStudios[0].name
                            },
                            _id: expect.any(String)
                        } 
                    );
                });
            });
    });

    it('gets a film when supplied film id', () =>{
        const id = createdFilms[0]._id;
        return request(app)
            .get(`/films/${id}`)
            .then(returnedFilm => {
                expect(returnedFilm.body).toEqual({
                    title: createdFilms[0].title,
                    released: createdFilms[0].released,
                    studio: {
                        _id: createdStudios[0]._id,
                        name: createdStudios[0].name
                    },
                    cast: [
                        { 
                            _id: expect.any(String), 
                            role: 'Chief Troublemaker', 
                            actor: {
                                _id: createdActors[0]._id,
                                name: createdActors[0].name 
                            }
                        },
                        { 
                            _id: expect.any(String), 
                            role: 'Sidekick', 
                            actor: {
                                _id: createdActors[1]._id,
                                name: createdActors[1].name 
                            }
                        }

                    ]                 
                });
            });
        
    });

});
