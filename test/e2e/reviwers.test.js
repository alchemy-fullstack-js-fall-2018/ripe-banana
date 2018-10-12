require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('reviewer pub/sub API', () => {

    let reviewers = [
        {
            name: chance.name({ suffix: true }),
            company: chance.company()
        },
        {
            name: chance.name({ suffix: true }),
            company: chance.company()
        },
        {
            name: chance.name({ suffix: true }),
            company: chance.company()
        },
    ];

    let createdReviewers;

    const createReviewer = reviewer => {
        return request(app)
            .post('/api/reviewers')
            .send(reviewer)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('reviewers');
    });

    beforeEach(() => {
        return Promise.all(reviewers.map(createReviewer))
            .then(reviewerRes => createdReviewers = reviewerRes);
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


});
