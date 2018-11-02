require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const { createReviewers } = require('./helpers');
const { dropCollection } = require('./db');

afterAll(() => {
    mongoose.disconnect();
});

describe.skip('reviewers route', () => {
    let createdReviewers;

    beforeEach(() => {
        return dropCollection('reviewers');
    });

    beforeEach(() => {
        return createReviewers()
            .then(res => {
                createdReviewers = res;
            });
    });

    it('creates a reviewer', () => {
        return request(app).post('/api/reviewers')
            .send({
                name: 'Tommy Applegate',
                company: 'notlovingit.com'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Tommy Applegate',
                    company: 'notlovingit.com'
                });
            });
    });

    it('gets all reviewers', () => {
        return request(app).get('/api/reviewers')
            .then(retrievedReviewers => {
                createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual(createdReviewer);
                });
            });
    });

    it('gets reviewer by id', () => {
        return request(app).get(`/api/reviewers/${createdReviewers[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdReviewers[0], __v: expect.any(Number) });
            });
    });
});
