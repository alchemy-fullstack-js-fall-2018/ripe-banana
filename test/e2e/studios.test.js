const request = require('supertest');
const app = require('../../lib/app');

describe('validates a vertical slice of the Studio route', () => {

    it('Posts to Studio', () => {
        return request(app)
            .post('/api/studios')
            .send({
                name: 'Compost Cinema', //false positive ?, required failing
                address: {
                    city: 'Portland',
                    state: 'OR',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(String),
                    name: 'Compost Cinema',
                    address: {
                        city: 'Portland',
                        state: 'OR',
                        country: 'United States'
                    }
                });            
            });
    });



    
});




