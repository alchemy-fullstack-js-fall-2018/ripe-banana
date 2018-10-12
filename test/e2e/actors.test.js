const request = require('supertest');
const app = require('../../lib/app');
//const { dropCollection } = require('./db');

describe('actors', () => {

    it('creates an actor', () => {
        const newActor = {
            name: 'Sir Clancy Yorkshire IV',
            dob: new Date('12-12-1934'),
            pob: 'New Jersey'
        };
        return request(app)
            .post('/actors')
            .send(newActor)
            .then(result => {
                expect(result.body).toEqual({
                    ...newActor,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

});