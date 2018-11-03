const { dropCollection } = require('./db');
const Reviewer = require('../../lib/models/Reviewer');
const app = require('../../lib/app');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const Chance = require('chance');
const { createReviewers } = require('./helpers');
const chance = new Chance();


const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const checkOk = res => checkStatus(200)(res);

const withToken = reviewer => {
    return request(app)
        .post('/auth/signin')
        .send({ name: `${reviewer.name}`, clearPassword: `${reviewer.clearPassword}` })
        .then(({ body }) => body.token);
};

describe('auth', () => {
    const users = Array.apply(null, { length: 1 })
    .map(() => ({ name: chance.name(), clearPassword: chance.word(), company: chance.company() }));

    let createdReviewers;
    
    let token;
    beforeEach(async() => {
        await dropCollection('reviewers');
        await createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
        await withToken(createdReviewers[0]).then(createdToken => {
            token = createdToken;
        });
    });

    it('hashes a reviewer\'s password', () => {
        return Reviewer.create({
            name: 'mike',
            company: 'Enron',
            clearPassword: 'testing1234',
            email: 'mike@test.com'
        }).then(reviewer => {
            expect(reviewer.clearPassword).not.toEqual('testing1234');
            expect(bcrypt.compareSync('testing1234', reviewer.passwordHash));
        });
    });
    
    it('creates a user on signup', () => {
        return request(app)
            .post('/auth/signup')
            .send({ name: 'mike', company: 'Alphabet', clearPassword: 'testing1234' })
            .then(({ body: reviewer }) => {
                expect(reviewer).toEqual({ _id: expect.any(String), name: 'mike', company: 'Alphabet' });
            });
    });
    
    it.only('signs in a user', () => {

        const newReviewer = { name: 'mike', company: 'Alphabet', clearPassword: 'testing1234' };

        return request(app)
            .post('/auth/signup')
            .send(newReviewer)
            .then(reviewer => {
                return request(app)
                    .post('/auth/signin')
                    .send({ name: reviewer.body.name, clearPassword: 'Banana' })
                    .then(res => {
                        checkOk(res);
            
                        expect(res.body.token).toEqual(expect.any(String));
                    });
            });
    });
    
    it('rejects signing in a bad user', () => {

        const newReviewer = { name: 'mike', company: 'Alphabet', clearPassword: 'testing1234' };
        return request(app)
            .post('/auth/signup')
            .send(newReviewer)
            .then(reviewer => {
                return request(app)
                    .post('/auth/signin')
                    .send({ name: reviewer.body.name, clearPassword: `${newReviewer.clearPassword}` })
                    .then(checkStatus(401));
            });

    });
    
    it('rejects signing in a user with bad email', () => {
        return request(app)
            .post('/api/auth/signin')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: `${createdUsers[0].email}`, clearPassword: `${users[0].clearPassword}1234` })
            .then(checkStatus(401));
    });
});
