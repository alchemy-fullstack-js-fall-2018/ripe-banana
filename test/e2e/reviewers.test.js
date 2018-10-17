require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const { createReviewers, createReviews, createFilms } = require('../util/helpers');

describe('reviewer pub/sub API', () => {
    
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    beforeEach(() => {
        return dropCollection('reviews');
    });
    beforeEach(() => {
        return dropCollection('films');
    });

    let createdReviewers;
    beforeEach(() => {
        createdReviewers = [];
        return createReviewers(1, createdReviewers);
    });
    
    let createdFilms;
    beforeEach(() => {
        createdFilms = [];
        return createFilms(1, createdFilms);
    });

    let createdReviews;
    beforeEach(() => {
        createdReviews = [];
        return createReviews(1, createdReviews);
    });


    it('creates a reviewer', () => {
        return request(app)
            .post('/api/reviewers')
            .send({
                name: 'Ms. Reviewer',
                company: 'Review People'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Ms. Reviewer',
                    company: 'Review People'
                });  
            });
    });

    it('gets all reviewers', () => {
        return request(app)
            .get('/api/reviewers')
            .then(retrievedReviewers => {
                createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual(createdReviewer);
                });
            });
    });

    it('gets reviewer by id', () => {
        return request(app)
            .get(`/api/reviewers/${createdReviewers[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdReviewers[0], __v: expect.any(Number), reviews: [] });
            });
    });

    it('gets reviewer by id with reviews and films', () => {
        return request(app)
            .get(`/api/reviewers/${createdReviews[0].reviewer}`)
            .then(res => {
                expect(res.body).toEqual({ 
                    __v: expect.any(Number),
                    _id: createdReviews[0].reviewer,
                    name: 'Steve',
                    company: 'A Company',
                    reviews: [{
                        _id: createdReviews[0]._id,
                        rating: createdReviews[0].rating,
                        review: createdReviews[0].review,
                        film: {
                            _id: createdReviews[0].film,
                            title: 'Hot Pursuit'
                        }
                    }]
                });
            });
    });

    it('updates an reviewer by id', () => {
        return request(app)
            .put(`/api/reviewers/${createdReviewers[0]._id}`)
            .send({ name: 'Cole Smithy' })
            .then(res => {
                expect(res.body).toEqual({ ...createdReviewers[0], name: 'Cole Smithy' });
            });
    });


});
