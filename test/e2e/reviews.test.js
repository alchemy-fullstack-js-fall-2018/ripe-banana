require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { createReviews } = require('../util/helpers');

describe('reviews pub/sub API', () => {
    beforeEach(() => {
        return dropCollection('actors');
    });

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    beforeEach(() => {
        return dropCollection('reviews');
    });

    let createdReviews;
    
    beforeEach(() => {
        createdReviews = [];
        return createReviews(2, createdReviews);
    });
    
    it('creates a review', () => {
        return request(app)
            .post('/api/reviews')
            .send({
                rating: 1,
                reviewer: '5bc538a598699b1177437b22', 
                review: 'Horrible Movie',
                film: '5bc60e6449fe9415026c2038'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    rating: 1, 
                    reviewer: expect.any(String),
                    review: 'Horrible Movie',
                    film: expect.any(String)
                });
            });
    });
});
