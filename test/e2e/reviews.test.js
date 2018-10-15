require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { createActorsArr } = require('../util/helpers');

describe('reviews pub/sub API', () => {
    let films = [
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        },
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        },
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        }
    ];

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

    let reviews = [
        {
            rating: chance.natural({ min:1, max: 5 }),
            review: chance.sentence({ words: 7 }) 
        },
        {
            rating: chance.natural({ min:1, max: 5 }),
            review: chance.sentence({ words: 7 }) 
        },
        {
            rating: chance.natural({ min:1, max: 5 }),
            review: chance.sentence({ words: 7 }) 
        }
    ];

    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    beforeEach(() => {
        return dropCollection('reviews');
    });

    const createFilm = film => {
        return request(app)
            .post('/api/films')
            .send(film)
            .then(res => res.body);
    };
    const createReviewer = reviewer => {
        return request(app)
            .post('/api/reviewers')
            .send(reviewer)
            .then(res => res.body);
    };
    const createReview = review => {
        return request(app)
            .post('/api/reviews')
            .send(review)
            .then(res => res.body);
    };

        
    let createdFilms;
    let createdReviewers;
    let createdReviews;
    let createdActors;

    beforeEach(() => {
        createdActors = createActorsArr();
        createdActors.forEach((actor, index) => {
            films[index].cast[0].actor = actor._id;
        });
    });

    beforeEach(() => {
        return Promise.all(films.map(createFilm))
            .then(filmRes => {
                createdFilms = filmRes;
                createdFilms.forEach((film, index) => {
                    reviews[index].film = film._id;
                });
            });
    });

    beforeEach(() => {
        return Promise.all(reviewers.map(createReviewer))
            .then(reviewerRes => {
                createdReviewers = reviewerRes;
                createdReviewers.forEach((reviewer, index) => {
                    reviews[index].reviewers = reviewers._id;
                });
            });
    });

    beforeEach(() => {
        return Promise.all(reviews.map(createReview))
            .then(reviewRes => createdReviews = reviewRes);
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
