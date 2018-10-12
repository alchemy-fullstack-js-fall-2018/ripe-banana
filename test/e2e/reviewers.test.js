const request = require('supertest');
const app = require('../../lib/app');

const { dropCollection } = require('./db');

describe('reviewers', () => {

    beforeEach(() => {
        return dropCollection('reviewers');
    });

    it('creates an reviewer', () => {
        const newReviewer = {
            name: 'Roger Siskel',
            company: 'At the Movies'
        };
        return request(app)
            .post('/reviewers')
            .send(newReviewer)
            .then(result => {
                expect(result.body).toEqual({
                    ...newReviewer,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

});

