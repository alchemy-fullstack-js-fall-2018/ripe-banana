const request = require('supertest');
const app = require('../../lib/app');

describe('studio', () => {

    it('creates a studio', () => {
        const newStudio = {
            name: 'Laika',
            address: {
                city: 'Hillsboro',
                state: 'OR',
                country: 'USA'
            }
        };
        console.log(newStudio);
        return request(app)
            .post('/studios')
            .send(newStudio)
            .then(result => {
                console.log(result);
                expect(result.body).toEqual({
                    ...newStudio,
                    __v: expect.any(String),
                    _id: expect.any(String)
                });
            });

    });

});


