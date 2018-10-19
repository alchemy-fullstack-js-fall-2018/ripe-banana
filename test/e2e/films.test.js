require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createActors, createReviewers, createStudios } = require('./helpers');

afterAll(() => {
    mongoose.disconnect();
});

describe('film routes', () => {
    
    let createdActors;
    let createdReviewers;
    let createdStudios;
    let createdFilms;

    const createFilm = film => {
        return request(app).post('/api/films')
            .send(film)
            .then(res => {
                return res.body;
            });
    }; 

    const createReview = review => {
        return request(app)
            .post('/api/reviews/')
            .send(review)
            .then(res => res.body);
    };
    
    beforeEach(() => {
        return Promise.all([
            dropCollection('actors'),
            dropCollection('reviewers'),
            dropCollection('studios'),
            dropCollection('films')
        ]);
    });

    
    beforeEach(() => {
        return createActors()
            .then(res => {
                createdActors = res;
            });
    });

    beforeEach(() => {
        return createReviewers()
            .then(res => {
                createdReviewers = res;
            });        
    });

    beforeEach(() => {
        return createStudios()
            .then(res => {
                createdStudios = res;
            });
    });
    
    beforeEach(() => {
        let films = [            
            {
                title: 'Run Lola Run',
                studio: createdStudios[0]._id,
                released: 1999,
                cast: [
                    { role: 'Lola', actor: createdActors[1]._id },
                    { role: 'Manni', actor: createdActors[0]._id }
                ]
            },
            {
                title: 'Goodfellas',
                studio: createdStudios[1]._id,
                released: 1990,
                cast: [
                    { role: 'Henry Hill', actor: createdActors[0]._id },
                    { role: 'Jimmy Conway', actor: createdActors[1]._id }
                    
                ]
            }
        ];
        return Promise.all(films.map(createFilm))
            .then(res => {
                createdFilms = res;
            });
    });
        
    beforeEach(() => {
        return createReview({ 
            rating: 5,
            reviewer: createdReviewers[0]._id,
            review: 'greatest mob movie EVER',
            film: createdFilms[1]._id
        });
        
    });

    it('creates a film on POST', () => {
        return request(app).post('/api/films')
            .send({
                title: 'Austin Powers: International Man of Mystery',
                studio: createdStudios[0]._id,
                released: 1999,
                cast: [
                    {
                        role: 'Austin Powers',
                        actor: createdActors[0]._id
                    },
                    {
                        role: 'Scott Evil',
                        actor: createdActors[1]._id
                    }
                ]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    title: 'Austin Powers: International Man of Mystery',
                    studio: expect.any(String),
                    released: 1999,
                    cast: [
                        {
                            _id: expect.any(String),
                            role: 'Austin Powers',
                            actor: expect.any(String)
                        },
                        {
                            _id: expect.any(String),
                            role: 'Scott Evil',
                            actor: expect.any(String)
                        }
                    ]
                });
            });
    });
    it('gets all films', () => {
        return request(app).get('/api/films')
            .then(retrievedFilms => {
                createdFilms.forEach((createdFilm, i) => {
                    expect(retrievedFilms.body).toContainEqual({ ...createdFilm, studio: { _id: createdStudios[i]._id, name: createdStudios[i].name } });
                });                
                expect(retrievedFilms.body).toHaveLength(createdFilms.length);
            });
    });

    it('gets a film by id', () => {
        const id = createdFilms[1]._id;
        return request(app).get(`/api/films/${id}`)
            .then(retrievedFilm => {
                expect(retrievedFilm.body)
                    .toEqual({
                        title: 'Goodfellas',
                        studio: { 
                            _id: createdStudios[1]._id,
                            name: createdStudios[1].name
                        },
                        released: 1990,
                        cast: [
                            { 
                                _id: expect.any(String),
                                role: 'Henry Hill',
                                actor: {
                                    _id: createdActors[0]._id,
                                    name: createdActors[0].name 
                                } 
                            },
                            { 
                                _id: expect.any(String),
                                role: 'Jimmy Conway',
                                actor: {
                                    _id: createdActors[1]._id,
                                    name: createdActors[1].name
                                } 
                            }
                        ],
                        
                        reviews: [{
                            _id: expect.any(String),
                            rating: 5,
                            review: 'greatest mob movie EVER',
                            reviewer: createdReviewers[0]._id
                        }],

                        _id: expect.any(String),
                        __v: expect.any(Number) });
            });
    });
});
