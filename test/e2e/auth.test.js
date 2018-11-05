const { dropCollection } = require('./db');
const Reviewer = require('../../lib/models/Reviewer');
const app = require('../../lib/app');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const Chance = require('chance');
const chance = new Chance();


const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const checkOk = res => checkStatus(200)(res);

describe('auth', () => {
    let reviewers = Array.apply(null, { length: 1 })
        .map(() => ({ name: chance.name(), email: chance.email(), roles: 'Admin', clearPassword: chance.word(), company: chance.company() }));

    let token;

    beforeEach(async() => {
        await dropCollection('reviewers');
    });

    it('hashes a reviewer\'s password', () => {
        return Reviewer.create({
            name: 'mike',
            company: 'Enron',
            email: 'mike@enron.com',
            clearPassword: 'testing1234',
            roles: 'Admin'
        }).then(reviewer => {
            expect(reviewer.clearPassword).not.toEqual('testing1234');
            expect(bcrypt.compareSync('testing1234', reviewer.passwordHash));
        });
    });
    
    it('creates a user on signup', () => {
        return request(app)
            .post('/auth/signup')
            .send(reviewers[0])
            .then(({ body: reviewer }) => {
                expect(reviewer).toEqual({ _id: expect.any(String), company: reviewers[0].company, name: reviewers[0].name, roles: reviewers[0].roles, email: reviewers[0].email });
            });
    });
    
    it('signs in a user', () => {
        return request(app)
            .post('/auth/signup')
            .send(reviewers[0])
            .then(reviewer => {
                return request(app)
                    .post('/auth/signin')
                    .send({ email: reviewer.body.email, clearPassword: reviewers[0].clearPassword })
                    .then(res => {
                        checkOk(res);
                        expect(res.body.token).toEqual(expect.any(String));
                    });
            });
    });
    
    it('rejects signing in a bad user', () => {
        return request(app)
            .post('/auth/signup')
            .send(reviewers[0])
            .then(reviewer => {
                return request(app)
                    .post('/auth/signin')
                    .send({ name: reviewer.body.name, clearPassword: `${reviewers[0].clearPassword}123` })
                    .then(checkStatus(401));
            });

    });
    
    it('rejects signing in a user with bad email', () => {
        return request(app)
            .post('/auth/signup')
            .send(reviewers[0])
            .then(reviewer => { 
                return request(app)
                    .post('/api/auth/signin')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: `${reviewer.body.name}123`, clearPassword: `${reviewers[0].clearPassword}` })
                    .then(checkStatus(401));

            });
    });
});
