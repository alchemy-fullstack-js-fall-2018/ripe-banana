require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
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

    beforeEach(() => {
        return dropCollection('actors');
    });

    beforeEach(() => {
        return dropCollection('reviewers');
    });

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return dropCollection('films');
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
                title: 'Goodfellas',
                studio: createdStudios[1]._id,
                released: 1990,
                cast: [
                    { role: 'Henry Hill', actor: createdActors[0]._id },
                    { role: 'Jimmy Conway', actor: createdActors[1]._id }
    
                ]
            },
            {
                title: 'Run Lola Run',
                studio: createdStudios[0]._id,
                released: 1999,
                cast: [
                    { role: 'Lola', actor: createdActors[1]._id },
                    { role: 'Manni', actor: createdActors[0]._id }
                ]
            }
        ];
        return Promise.all(films.map(createFilm))
            .then(res => {
                createdFilms = res;
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
                createdFilms.forEach(createdFilm => {
                    expect(retrievedFilms.body).toContainEqual(createdFilm);
                });                
                expect(retrievedFilms.body).toHaveLength(createdFilms.length);
            });
    });

    it('gets a film by id', () => {
        const id = createdFilms[1]._id;
        return request(app).get(`/api/films/${id}`)
            .then(retrievedFilm => {
                expect(retrievedFilm.body)
                    .toEqual({ ...createdFilms[1], __v: expect.any(Number) });
            });

    });
});
