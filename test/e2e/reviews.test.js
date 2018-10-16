require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { createActors, createStudios, createReviewers, createFilms, createReviews } = require('../util/helpers');

describe('reviews pub/sub API', () => {
    
    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    beforeEach(() => {
        return dropCollection('reviews');
    });

    let createdFilms;
    let createdReviewers;
    let createdReviews;
    let createdActors;
    let createdStudios;

    beforeEach(() => {
        createdActors = [];
        return createActors(3, createdActors);
       
    });

    beforeEach(() => {
        createdStudios = [];
        return createStudios(3, createdStudios);
    });
    beforeEach(() => {
        createdReviewers = [];
        return createReviewers(3, createdReviewers);
    });

    beforeEach(() => {
        createdFilms = [];
        return createFilms(3, createdFilms);
    });


    beforeEach(() => {
        createdReviews = [];
        return createReviews(3, createdReviews);
    });
    
    it('creates a review', () => {
        return request(app)
            .post('/api/reviews')
            .send(reviews[0])
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    ...reviews[0]
                });
            });
    });
});
