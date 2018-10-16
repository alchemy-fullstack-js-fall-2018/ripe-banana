const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createReviewers } = require('./helpers');

describe('reviewers', () => {

    let createdReviewers;
    
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    
    beforeEach(() => {
        return createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
    });

    it('creates a reviewer', () => {
        const newReviewer = {
            name: 'Roger Siskel',
            company: 'At the Movies'
        };
        return request(app)
            .post('/reviewers')
            .send(newReviewer)
            .then(result => {
                expect(result.body).toEqual({
                    ...newReviewer,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

    it('gets all reviewers', () => {
        return request(app)
            .get('/reviewers')
            .then(retrievedReviewers => {
                createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual(createdReviewer);
                });
            });
    });

    it('gets a specific reviewer when passed an id', () => {
        const id = createdReviewers[0]._id;
        return request(app)
            .get(`/reviewers/${id}`)
            .then(retrievedReviewer => {
                expect(retrievedReviewer.body).toEqual(createdReviewers[0]);
            });
    });

    it('updates a reviewers info', () => {
        const id = createdReviewers[0]._id;
        const newData = createdReviewers[0];
        newData.company = 'Founder\'s films';
        return request(app)
            .put(`/reviewers/${id}`)
            .send(newData)
            .then(result => {
                expect(result.body).toEqual(newData);
            });
    });



});

