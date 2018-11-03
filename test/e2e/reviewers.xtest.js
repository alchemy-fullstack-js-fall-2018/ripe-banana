const request = require('supertest');
const app = require('../../lib/app');
const bcrypt = require('bcryptjs');
const Reviewer = require('../../lib/models/Reviewer');
const { dropCollection } = require('./db');
const { createReviewers, createActors, createStudios } = require('./helpers');

describe('reviewers', () => {

    let createdReviewers;
    let createdActors;
    let createdStudios;
    let createdFilms;
    let createdReviews;

    const checkStatus = statusCode => res => {
        expect(res.status).toEqual(statusCode);
    };
    
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

