const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createStudios, createActors, createReviewers, createReviewerTokens } = require('./helpers');

describe('reviews', () => {

    let createdStudios;
    let createdActors;
    let createdReviewers;
    let createdReviewerTokens;
    let createdFilms;
    let createdReviews;

    const createReview = review => {
        return request(app)
            .post('/reviews')
            .set('Authorization', `Bearer ${createdReviewerTokens[0]}`)
            .send(review)
            .then(res => res.body);
    };

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    beforeEach(() => {
        return Promise.all([
            dropCollection('reviewers'),
            dropCollection('studios'),
            dropCollection('actors'),
            dropCollection('films'),
            dropCollection('reviews')
        ]);
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
            });
    });
       
    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });
    
    beforeEach(() => {
        return createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
    });

    beforeEach(() => {
        return createReviewerTokens()
            .then(tokensRes => { 
                createdReviewerTokens = tokensRes;
            });
    });

    beforeEach(() => {
        let films = [
            {
                title: 'The Programinator',
                studio: createdStudios[0]._id,
                released: 1984,
                cast: [
                    { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                    { role: 'Sidekick', actor: createdActors[1]._id }
                ]
            },
            {
                title: 'Thelma and Luigi',
                studio: createdStudios[0]._id,
                released: 1972,
                cast: [
                    { role: 'Thelma', actor: createdActors[1]._id }, 
                    { role: 'Luigi', actor: createdActors[0]._id }
                ]
            }
        ];
    
        return Promise.all(films.map(createFilm))
            .then(filmsRes => { createdFilms = filmsRes;});
    });

    beforeEach(() => {
        let reviews = [
            {
                rating: 5,
                reviewer: createdReviewers[0]._id,
                text: 'Amazeballs!',
                film: createdFilms[0]._id 
            },
            {
                rating: 1,
                reviewer: createdReviewers[0]._id,
                text: 'I want the last 1.5 hours of my life back.',
                film: createdFilms[1]._id 
            }
        ];

        return Promise.all(reviews.map(createReview))
            .then(reviewsRes => { createdReviews = reviewsRes;});

    });

    it('creates a review if you are signed in', () => {

        const reviewData = {
            rating: 3,
            reviewer: createdReviewers[0]._id,
            text: 'Meh...I\'ve seen better',
            film: createdFilms[0]._id
        };

        return request(app)
            .post('/reviews')
            .set('Authorization', `Bearer ${createdReviewerTokens[0]}`)
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
        const reviewData = {
            rating: 3,
            reviewer: createdReviewers[0]._id,
            text: 'Meh...I\'ve seen better',
            film: createdFilms[0]._id
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
        return request(app)
            .get('/reviews')
            .then(retrievedReviews => {
                createdReviews.forEach(createdReview => {
                    expect(retrievedReviews.body).toContainEqual({
                        _id: createdReview._id,
                        rating: createdReview.rating,
                        text: createdReview.text,
                        film: {
                            _id: createdReview.film,
                            title: expect.any(String)
                        }                        
                    });
                });
            });
    });
});
