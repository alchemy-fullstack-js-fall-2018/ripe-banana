const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createReviewers, createActors, createStudios } = require('./helpers');

describe('reviewers', () => {

    let createdReviewers;
    let createdActors;
    let createdStudios;
    let createdFilms;
    let createdReviews;
    
    const createReview = review => {
        return request(app)
            .post('/reviews')
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
            dropCollection('actors'),
            dropCollection('studios'),
            dropCollection('films'),
            dropCollection('reviews')
        ]);
    });
    
    beforeEach(() => {
        return createReviewers()
            .then(reviewersRes => { 
                createdReviewers = reviewersRes;
            });
    });

    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
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
                reviewer: createdReviewers[1]._id,
                text: 'I want the last 1.5 hours of my life back.',
                film: createdFilms[1]._id 
            }
        ];

        return Promise.all(reviews.map(createReview))
            .then(reviewsRes => { createdReviews = reviewsRes;});

    });

    it('creates a reviewer', () => {
        const newReviewer = {
            name: 'Roger Siskel',
            company: 'At the Movies',
            clearPassword: 'abcd',
            email: 'roger@roger.com',
            roles: 'Admin'
        };
        return request(app)
            .post('/reviewers')
            .send(newReviewer)
            .then(result => {
                expect(result.body).toEqual({
                    name: 'Roger Siskel',
                    company: 'At the Movies',
                    email: 'roger@roger.com',
                    roles: 'Admin',
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
                expect(retrievedReviewer.body).toEqual({
                    _id: createdReviewers[0]._id,
                    name: createdReviewers[0].name,
                    company: createdReviewers[0].company,
                    email: createdReviewers[0].email,
                    roles: createdReviewers[0].roles,
                    reviews:[{
                        _id: createdReviews[0]._id,
                        rating: createdReviews[0].rating,
                        text: createdReviews[0].text,
                        film: {
                            _id: createdFilms[0]._id,
                            title: createdFilms[0].title
                        }
                    }]
                });
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

