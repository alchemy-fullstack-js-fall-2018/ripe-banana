require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Studio = require('../../lib/models/Studio');
const { createActors } = require('./helpers');
const { dropCollection } = require('./db');

afterAll(() => {
    mongoose.disconnect();
});

describe('studio route', () => {

    let studios = [
        {
            name: 'A24',
            address: {
                city: 'New York',
                state: 'NY',
                country: 'USA'
            }            
        },
        {
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }            
        },
        {
            name: 'Pixar',
            address: {
                city: 'Emeryville',
                state: 'CA',
                country: 'USA'
            }            
        }
    ];

    let createdStudios;
    let createdActors;
    let createdFilm;

    const createStudio = studio => {
        return request(app)
            .post('/api/studios/')
            .send(studio)
            .then(res => res.body);
    };

    beforeEach(() => {
        Promise.all([
            dropCollection('studios'),
            dropCollection('films'),
            dropCollection('actors')
        ]); 
    });

    beforeEach(() => {
        return createActors()
            .then(res => {
                createdActors = res;
            });
    });

    beforeEach(() => {
        return Promise.all(studios.map(createStudio))
            .then(studiosRes => {
                createdStudios = studiosRes;
            });
    });

    beforeEach(() => {
        return request(app).post('/api/films')
            .send({
                title: 'Run Lola Run',
                studio: createdStudios[0]._id,
                released: 1999,
                cast: [
                    { role: 'Lola', actor: createdActors[0]._id }
                ]
            })
            .then(res => {
                createdFilm = res.body;
            });
    });


    it('creates a studio on POST', () => {
        return request(app).post('/api/studios')
            .send({
                name: 'A24',
                address: {
                    city: 'New York',
                    state: 'NY',
                    country: 'USA'
                }           
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'A24',
                    address: {
                        city: 'New York',
                        state: 'NY',
                        country: 'USA'
                    }           
                });
            });
    });

    it('gets all studios', () => {
        return request(app).get('/api/studios')
            .then(retrievedStudios => {
                createdStudios.forEach(createdStudio => {
                    expect(retrievedStudios.body).toContainEqual(createdStudio);
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app).get(`/api/studios/${createdStudios[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdStudios[0], films: [{ _id: createdFilm._id, title: createdFilm.title }], __v: expect.any(Number) });
            });
    });

     //TODO: DELETE STUDIO. CAN'T DELETE STUDIO IF THERE ARE FILMS
});
