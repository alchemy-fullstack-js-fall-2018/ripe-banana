const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');
const { Types } = require('mongoose');


describe.skip('validates a vertical slice of the Reviewer route', () => {
   
    beforeEach(() => {
        return dropCollection('studios');
    });
    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return dropCollection('reviewers');
    });
    beforeEach(() => {
        return dropCollection('reviews');
    });

    let createdActors;
    let createdStudios;
    let createdFilms;
    let createdReviewers;
    let createdReviews;

    let reviews = [
        {
            rating: 5,
            review: 'This is a badass review of of film 0',
            reviewer: Types.ObjectId(),
            film: Types.ObjectId()
            
        },
        {
            rating: 2,
            review: 'This is mediocre review of of film 1',
            reviewer: Types.ObjectId(),
            film: Types.ObjectId()
            
        }

    ];

    let actors =  [{
        name: 'Anna Peel',
        dob: new Date(),
        pob: 'Brazil'
    },
    {
        name: 'Lud Orange',
        dob: new Date(),
        pob: 'Florida'
    }];

    let studios =  [{
        name: 'Compost Cinema', 
        address: {
            city: 'Portland',
            state: 'OR',
            country: 'United States'
        }
    },
    {
        name: 'Compost Cinema2', 
        address: {
            city: 'Portland2',
            state: 'OR',
            country: 'United States'
        }
    }];

    let films =  [{
        title: 'Bladecrawler',
        released: 1991,
        cast: [{
            role: 'lead',
        }]
    },
    {
        title: 'Bladewalker',
        released: 1992,
        cast: [{
            role: 'Deckard',
        }]
    }];

    let reviewers =  [{
        name: 'CreatedReviewer1', 
        company: 'CreatedCompany1'
    },
    {
        name: 'CreatedReviewer2', 
        company: 'CreatedCompany2'
    }
    ];
        
    const createActor = actor => {
        return request(app)
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    };

    const createStudio = studio => {
        return request(app)
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);
    };

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

    beforeEach(() => {
        return Promise.all(actors.map(createActor)).then(actorsRes => {
            createdActors = actorsRes;
            films[0].cast[0].actor = createdActors[0]._id;
            films[1].cast[0].actor = createdActors[1]._id;
        });
    });

    beforeEach(() => {
        return Promise.all(studios.map(createStudio)).then(studiosRes => {
            createdStudios = studiosRes;
            films[0].studio = createdStudios[0]._id;
            films[1].studio = createdStudios[1]._id;
        });
    });
        
    beforeEach(() => {
        return Promise.all(films.map(createFilm)).then(filmsRes => {
            createdFilms = filmsRes;
            reviews[0].film = createdFilms[0]._id;
            reviews[1].film = createdFilms[1]._id;
        });
    });

    beforeEach(() => {
        return Promise.all(reviewers.map(createReviewer)).then(reviewersRes => {
            createdReviewers = reviewersRes;
            reviews[0].reviewer = createdReviewers[0]._id;
            reviews[1].reviewer = createdReviewers[1]._id;
        });
    });

    beforeEach(() => {
        return Promise.all(reviews.map(createReview)).then(reviewsRes => {
            createdReviews = reviewsRes;
        });
    });


    it('Posts to Reviewer', () => {
        return request(app)
            .post('/api/reviewers')
            .send({
                name: 'CreatedReviewer4', 
                company: 'CreatedCompany4'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'CreatedReviewer4', 
                    company: 'CreatedCompany4'
                });            
            });
    });

    it('gets all Reviewers', () => {
        return request(app)
            .get('/api/reviewers')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdReviewers[0]._id,
                    name: createdReviewers[0].name,
                    company: createdReviewers[0].company
                });
                expect(res.body).toContainEqual({
                    _id: createdReviewers[1]._id,
                    name: createdReviewers[1].name,
                    company: createdReviewers[1].company
                });
              
            });
    });

    it('gets a Reviewer by id', () => {
        return request(app)
            .get(`/api/reviewers/${createdReviewers[1]._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: createdReviewers[1]._id,
                    name: createdReviewers[1].name,
                    company: createdReviewers[1].company,
                    reviews: [{
                        _id: createdReviews[1]._id,
                        rating: createdReviews[1].rating,
                        review: createdReviews[1].review,
                        film: {
                            _id: createdReviews[1].film,
                            title: createdFilms[1].title
                        }
                    }]
                });
            });

    });

    it('deletes a Reviewer by id', () => {
        return request(app)
            .delete(`/api/reviewers/${createdReviewers[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('updates a Reviewer by id', () => {
        return request(app)
            .put(`/api/reviewers/${createdReviewers[1]._id}`)
            .send({
                name: 'CreatedReviewer5', 
                company: 'CreatedCompany5'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'CreatedReviewer5', 
                    company: 'CreatedCompany5'
                });            
            });
    });

});




