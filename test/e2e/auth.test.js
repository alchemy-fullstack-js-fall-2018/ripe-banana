const { dropCollection } = require('./db');
const User = require('../../lib/models/User');
const app = require('../../lib/app');
const request = require('supertest');
const Chance = require('chance');
const chance = new Chance();

const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const checkOk = res => checkStatus(200)(res);

const withToken = user => {
    return request(app)
        .post('/api/auth/signin')
        .send({ 
            name: `${user.name}`, 
            email: `${user.email}`, 
            clearPassword: `${user.clearPassword}` 
        })
        .then(({ body }) => body.token);
};

describe('auth routes', () => {
    const users = Array.apply(null, { length: 3 })
        .map(() => ({ name: chance.name(), email: chance.email, clearPassword: chance.word() }));
    
    let createdUsers;

    const createUser = user => {
        return User.create(user);
    };

    beforeEach(() => {
        return dropCollection('users');
    });

    beforeEach(() => {
        return Promise.all(users.map(createUser))
            .then(cs => {
                createdUsers = cs;
            });
    });

    let token;

    beforeEach(() => {
        return withToken(users[0]).then(createdToken => {
            token = createdToken;
        });
    });

    it('creates a user on signup', () => {
        return request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Sophie',
                email: 'sophie@test.com',
                clearPassword: '1234'
            })
            .then(({ body: user }) => {
                expect(user).toEqual({
                    _id: expect.any(String),
                    name: 'Sophie',
                    email: 'sophie@test.com'                    
                });
            });
    });

    it('signs in a user', () => {
        return request(app)
            .post('/api/auth/signin')
            .send({ email: createdUsers[0].email, clearPassword: users[0].clearPassword })
            .then(res => {
                checkOk(res);

                expect(res.body.token).toEqual(expect.any(String));
            });
    });

    it('rejects signing in a bad user', () => {
        return request(app)
            .post('/api/auth/signin')
            .send({ email: createdUsers[0].email, clearPassword: `${users[0].clearPassword}1234` })
            .then(checkStatus(401));
    });

    it.skip('rejects signing in a user with a bad email', () => {
        return request(app)
            .post('api/auth/signin')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: `${createdUsers[0].email}`, clearPassword: `${users[0].clearPassword}1234` })
            .then(checkStatus(401));
    });

    it.skip('verifies a signed in user', () => {
        return withToken(users[0])
            .then(token => {
                return request(app)
                    .get('/api/auth/verify')
                    .set('Authorization', `Bearer ${token}`)
                    .then(res => {
                        expect(res.body).toEqual({ success: true });
                    });
            });

    });


});
