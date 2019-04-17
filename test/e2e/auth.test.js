const { dropCollection } = require('./db');
const Reviewer = require('../../lib/models/Reviewer');
const app = require('../../lib/app');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { getReviewers } = require('./helpers');


const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const checkOk = res => checkStatus(200)(res);

const withToken = user => {
    return request(app)
        .post('/api/auth/signin')
        .send({ email: `${ reviewer.email }`, password: `${ reviewer.password }` })
        .then(({ body }) => body.token);
};

describe('auth routes', () => {
    it('hashes a users password', () => {
        return Reviewer.create({
            name: 'CreatedReviewer7', 
            company: 'CreatedCompany7',
            email: 'email7@email.com',
            role: 'admin',
            password: '1234asdqw'
        }).then(reviewer => {
            expect(reviewer.password).not.toEqual('1234asdqw');
            expect(bcrypt.compareSync('1234asdqw', reviewer.passwordHash));
        });
    });

});
