const app = require('../../lib/app');
const request = require('supertest');
require('./db');

describe('auth', () => {
    it('creates a reviewer/user on signup', () => {
        const newReviewer = {
            name: 'Roger Siskel',
            company: 'At the Movies',
            email: 'mrrogers@siskel.com',
            roles: ['admin'],
            clearPassword: 'movies123'

        };
        return request(app)
            .post('/auth/signup')
            .send(newReviewer)
            .then(result => {
                expect(result.body).toEqual({
                    name: newReviewer.name,
                    company: newReviewer.company,
                    email: newReviewer.email,
                    roles: newReviewer.roles,
                    _id: expect.any(String)
                });
            });
    });
});
