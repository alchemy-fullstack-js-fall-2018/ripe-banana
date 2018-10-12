require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
// const Actor = require('../../lib/models/Actor');

describe('actors route', () => {
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
});

