require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createActors, createReviewers, createStudios } = require('./helpers');

afterAll(() => {
    mongoose.disconnect();
});

describe('reviews routes', () => {

    let createdActors;
    let createdReviewers;
    let createdStudios;
    let createdFilms;
    let createdReviews;

    const createFilm = film => {
        return request(app).post('/api/films')
            .send(film)
            .then(res => {
                return res.body;
            });
    };

    const createReview = review => {
        return request(app).post('/api/reviews')
            .send(review)
            .then(res => {
                return res.body;
            });
    };
    beforeEach(() => {
        return Promise.all([
            dropCollection('actors'),
            dropCollection('reviewers'),
            dropCollection('studios'),
            dropCollection('films'),
            dropCollection('reviews')
        ]);
    });

    
    beforeEach(() => {
        return createActors()
            .then(res => {
                createdActors = res;
            });
    });

    beforeEach(() => {
        return createReviewers()
            .then(res => {
                createdReviewers = res;
            });        
    });

    beforeEach(() => {
        return createStudios()
            .then(res => {
                createdStudios = res;
            });
    });

    beforeEach(() => {
        let films = [            
            {
                title: 'Run Lola Run',
                studio: createdStudios[0]._id,
                released: 1999,
                cast: [
                    { role: 'Lola', actor: createdActors[1]._id },
                    { role: 'Manni', actor: createdActors[0]._id }
                ]
            },
            {
                title: 'Goodfellas',
                studio: createdStudios[1]._id,
                released: 1990,
                cast: [
                    { role: 'Henry Hill', actor: createdActors[0]._id },
                    { role: 'Jimmy Conway', actor: createdActors[1]._id }
    
                ]
            }
        ];
        return Promise.all(films.map(createFilm))
            .then(res => {
                createdFilms = res;
            });
    });

    beforeEach(() => {
        let reviews = [
            {
                rating: 4,
                reviewer: createdReviewers[1]._id,
                review: 'if you like Germans and aerobics, this film is for you!',
                film: createdFilms[0]._id  
            },
            {
                rating: 5,
                reviewer: createdReviewers[0]._id,
                review: 'greatest mob movie EVER',
                film: createdFilms[1]._id
            }
        ];
        
        return Promise.all(reviews.map(createReview))
            .then(res => {
                createdReviews = res;
            });
    });

    it('creates a review on POST', () => {
        const data = { 
            rating: 5,
            reviewer: createdReviewers[0]._id,
            review: 'greatest mob movie EVER',
            film: createdFilms[1]._id
        };
        return request(app).post('/api/reviews')
            .send(data)
            .then(res => {
                expect(res.body).toEqual({ 
                    rating: 5,
                    reviewer: createdReviewers[0]._id,
                    review: 'greatest mob movie EVER',
                    film: createdFilms[1]._id,
                    _id: expect.any(String),
                    __v: expect.any(Number) 
                });
            });
    });

    it('gets all reviews', () => {
        return request(app).get('/api/reviews')
            .then(retrievedReviews => {
                createdReviews.forEach((createdReview, i) => {
                    expect(retrievedReviews.body).toContainEqual({ ...createdReview, film: { _id: createdFilms[i]._id, title: createdFilms[i].title } });
                });
                expect(retrievedReviews.body).toHaveLength(createdReviews.length);

            });
    });
});
