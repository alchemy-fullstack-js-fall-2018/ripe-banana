const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

xdescribe('reviewers', () => {

    let reviewers = [
        { name: 'George Watchington', company: 'Patriot Films' },
        { name: 'Abraham Linkoln', company: 'Great Confilict Productions' }
    ];

    let createdReviewers;

    const createReviewer = reviewer => {
        return request(app)
            .post('/reviewers')
            .send(reviewer)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('reviewers');
    });

    beforeEach(() => {
        return Promise.all(reviewers.map(createReviewer))
            .then(reviewerRes => { createdReviewers = reviewerRes; });
    });

    it('creates an reviewer', () => {
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

