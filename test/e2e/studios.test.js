const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

describe('studio', () => {

    beforeEach(() => {
        return dropCollection('studios');
    });


    it('creates a studio', () => {
        const newStudio = {
            name: 'Laika',
            address: {
                city: 'Hillsboro',
                state: 'OR',
                country: 'USA'
            }
        };
        return request(app)
            .post('/studios')
            .send(newStudio)
            .then(result => {
                expect(result.body).toEqual({
                    ...newStudio,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });

    });

});


