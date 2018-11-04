const request = require('supertest');
const app = require('../../lib/app');
const bcrypt = require('bcryptjs');
const Reviewer = require('../../lib/models/Reviewer');
require('./db');
const { getReviewers, getReviewerTokens, getActors, getStudios, getFilms, getReviews } = require('./created');

describe('reviewers', () => {

    const checkStatus = statusCode => res => {
        expect(res.status).toEqual(statusCode);
    };

    it('signs up a reviewer', () => {

        const newReviewer = {
            name: 'Roger Siskel',
            company: 'At the Movies',
            email: 'mrrogers@siskel.com',
            clearPassword: 'movies123'

        };
        return request(app)
            .post('/reviewers/signup')
            .send(newReviewer)
            .then(result => {
                expect(result.body).toEqual({
                    name: newReviewer.name,
                    company: newReviewer.company,
                    email: newReviewer.email,
                    _id: expect.any(String),
                    roles: []
                });
            });
    });

    it('signs in a reviewer', () => {
        return request(app)
            .post('/reviewers/signin')
            .send({ email: 'Abe1809@askjeeves.com', clearPassword: 'fourScoreAndPasswordAgo' })
            .then(res => {
                checkStatus(200)(res);
                expect(res.body.token).toEqual(expect.any(String));
            });
    });

    it('gets all reviewers', () => {
        const reviewers = getReviewers();
        return request(app)
            .get('/reviewers')
            .then(retrievedReviewers => {
                reviewers.forEach(reviewer => {
                    expect(retrievedReviewers.body).toContainEqual(reviewer);
                });
            });
    });

    it('gets a specific reviewer when passed an id', () => {
        const reviewers = getReviewers();
        const reviews = getReviews();
        const films = getFilms();
        const id = reviewers[0]._id;

        return request(app)
            .get(`/reviewers/${id}`)
            .then(retrievedReviewer => {
                expect(retrievedReviewer.body).toEqual({
                    _id: reviewers[0]._id,
                    name: reviewers[0].name,
                    company: reviewers[0].company,
                    reviews:[{
                        _id: reviews[0]._id,
                        rating: reviews[0].rating,
                        text: reviews[0].text,
                        film: {
                            _id: films[0]._id,
                            title: films[0].title
                        }
                    },
                    {
                        _id: reviews[1]._id,
                        rating: reviews[1].rating,
                        text: reviews[1].text,
                        film: {
                            _id: films[1]._id,
                            title: films[1].title
                        }
                    }]
                });
            });
    });

    it('updates a reviewers info', () => {
        const reviewers = getReviewers();
        const id = reviewers[0]._id;
        const newData = reviewers[0];
        newData.company = 'Founder\'s films';
        return request(app)
            .put(`/reviewers/${id}`)
            .send(newData)
            .then(result => {
                expect(result.body).toEqual(newData);
            });
    });

    it('hashes a reviewers password', () => {
        return Reviewer.create({
            name: 'Roger Siskel',
            company: 'At the Movies',
            email: 'mrrogers@siskel.com',
            clearPassword: 'movies'
        }).then(reviewer => {
            expect(reviewer.clearPassword).not.toEqual('movies');
            expect(bcrypt.compareSync('movies', reviewer.hash));
        });
    });

    it('compares passwords', () => {
        const reviewerData = {
            name: 'Roger Siskel',
            company: 'At the Movies',
            email: 'mrrogers@siskel.com',
            clearPassword: 'movies123'

        };
        Reviewer.create(reviewerData)
            .then(newReviewer => {
                const validPassword = reviewerData.clearPassword;
                const invalidPassword = `${validPassword}extra`;
        
                const validCompare = newReviewer.compare(validPassword);
                const invalidCompare = newReviewer.compare(invalidPassword);
        
                expect(validCompare).toBeTruthy();
                expect(invalidCompare).toBeFalsy();
            }); 
    });
});

