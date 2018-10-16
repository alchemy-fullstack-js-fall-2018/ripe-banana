require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Actor = require('../../lib/models/Actor');
const { createActors } = require('./helpers');


afterAll(() => {
    mongoose.disconnect();
});

describe('actors route', () => {
    let createdActors;
    beforeEach(() => {
        createdActors = [];
        return Actor.deleteMany();
    });
    
    beforeEach(() => {
        return createActors(3, createdActors);
    });
    

    it('creates an actor', () => {
        return request(app).post('/api/actors')
            .send({
                name: 'Keanu Reeves',
                dob: new Date('September 2, 1964'),
                pob: 'Beirut, Lebanon'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Keanu Reeves',
                    dob: expect.any(String),
                    pob: 'Beirut, Lebanon'          
                });
            });
    });

    it('gets all actors', () => {
        return request(app).get('/api/actors')
            .then(retrievedActors => {
                createdActors.forEach(createdActor => {
                    expect(retrievedActors.body).toContainEqual(createdActor);
                });                
                expect(retrievedActors.body).toHaveLength(createdActors.length);
            });
    });
  

    it('gets actor by id', () => {
        return request(app).get(`/api/actors/${createdActors[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdActors[0], __v: expect.any(Number) });
            });
    });
});
