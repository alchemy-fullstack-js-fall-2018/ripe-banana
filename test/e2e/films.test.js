require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Actor = require('../../lib/models/Actor');
// const Film  = require('../../lib/models/Film');
const { createActors } = require('./helpers');


let createdActors = [];

beforeEach(() => {
    return Actor.deleteMany();
});

beforeEach(() => {
    return createActors(3, createdActors);
});

afterAll(() => {
    mongoose.disconnect();
});


describe('film routes', () => {
    it('creates a film on POST', () => {
        return request(app).post('/api/films')
            .send({
                title: 'Austin Powers: International Man of Mystery',
                studio: 'New Line Cinema',
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
                    studio: 'New Line Cinema',
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
        return request(app).get('/')
            .then(retrievedFilms => {
                
            })
    })
});
