require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const { createReviews } = require('../util/helpers');

describe.skip('reviews pub/sub API', () => {
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
        return createReviews(102, createdReviews);
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

    it('gets 100 reviews', () => {
        return request(app)
            .get('/api/reviews')
            .then(retrievedReviews => {

                createdReviews.forEach(() => {
                    expect(retrievedReviews.body).toContainEqual({
                        _id: expect.any(String),
                        rating: createdReviews[0].rating,
                        review: createdReviews[0].review,
                        film: { _id: createdReviews[0].film, title: 'Hot Pursuit' }
                    });
                });

                expect(retrievedReviews.body).toHaveLength(100);
            });
    });
});
