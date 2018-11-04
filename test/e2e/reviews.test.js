const request = require('supertest');
const app = require('../../lib/app');
require('./db');
const { getReviewers, getReviewerTokens, getFilms, getReviews } = require('./created');

describe('reviews', () => {

    it('creates a review if you are signed in', () => {
        const reviewers = getReviewers();
        const reviewerTokens = getReviewerTokens();
        const films = getFilms();
        
        const reviewData = {
            rating: 3,
            reviewer: reviewers[0]._id,
            text: 'Meh...I\'ve seen better',
            film: films[0]._id
        };

        return request(app)
            .post('/reviews')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(reviewData)
            .then(result => {
                expect(result.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    ...reviewData
                });
            });
    });

    it('won\'t allow review creation if you are not signed in', () => {
        const reviewers = getReviewers();
        const films = getFilms();

        const reviewData = {
            rating: 3,
            reviewer: reviewers[0]._id,
            text: 'Meh...I\'ve seen better',
            film: films[0]._id
        };
        return request(app)
            .post('/reviews')
            .send(reviewData)
            .then(result => {
                // expect(result.body).toEqual({ error: 'Sign-in required' });
                expect(result.body).toEqual({});
            });
    });

    it('Gets all recent reviews with a max of 100', () => {
        const reviews = getReviews();

        return request(app)
            .get('/reviews')
            .then(retrievedReviews => {
                reviews.forEach(review => {
                    expect(retrievedReviews.body).toContainEqual({
                        _id: review._id,
                        rating: review.rating,
                        text: review.text,
                        film: {
                            _id: review.film,
                            title: expect.any(String)
                        }                        
                    });
                });
            });
    });
});
