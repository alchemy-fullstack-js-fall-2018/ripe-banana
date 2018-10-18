require('dotenv').config();
const { dropCollection } = require('../util/db');
const app = require('../../lib/app');
const request = require('supertest');
const { createFilms, createStudios } = require('../util/helpers');

describe.skip('studios pub/sub API', () => {
    
    beforeEach(() => {
        return dropCollection('studios');
    });

    let createdFilms;
    beforeEach(() => {
        createdFilms = [];
        return createFilms(1, createdFilms);
    });

    let createdStudios;
    beforeEach(() => {
        createdStudios = [];
        return createStudios(3, createdStudios);
    });


    it('creates a studio on post', () => {
        return request(app)
            .post('/api/studios')
            .send({
                name: 'Marvel Studios',
                address: {
                    city: 'Burbank',
                    state: 'California',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Marvel Studios',
                    address: {
                        city: 'Burbank',
                        state: 'California',
                        country: 'United States'
                    }
                });
            });
    });

    it('gets all studios', () => {
        return request(app)
            .get('/api/studios')
            .then(retrievedStudios => {
                createdStudios.forEach(createdStudio => {
                    expect(retrievedStudios.body).toContainEqual({ _id: createdStudio._id, name: createdStudio.name });
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/api/studios/${createdStudios[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdStudios[0], __v: expect.any(Number), films: [] });
            });
    });

    it('get a studio by id with film', () => {
        return request(app)
            .get(`/api/studios/${createdFilms[0].studio}`)
            .then(res => {
                expect(res.body.films).toEqual(createdFilms);
            });
    });

    it('deletes a studio by id', () => {
        return request(app)
            .delete(`/api/studios/${createdStudios[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ removed: true });
            });
    });







});
