const request = require('supertest');
const app = require('../../lib/app');
const { getReviewers, getReviews, getFilms } = require('./helpers');

describe('end to end test of reviews', () => {

    it('posts a review', () => {
        const createdFilms = getFilms();
        const createdReviewers = getReviewers();

        return request(app)
            .post('/api/reviews')
            .send({
                rating: 1,
                reviewer: createdReviewers[0]._id,
                review: 'This is a terrible review of of film 0',
                film: createdFilms[0]._id
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    rating: 1,
                    reviewer: createdReviewers[0]._id,
                    review: 'This is a terrible review of of film 0',
                    film: createdFilms[0]._id, 
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                });
            
            });
    });

    it('gets all reviews', () => {
        const createdReviews = getReviews();
        const createdFilms = getFilms();
        
        return request(app)
            .get('/api/reviews')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdReviews[0]._id,
                    rating: createdReviews[0].rating,
                    review: createdReviews[0].review,
                    film: {
                        _id: createdReviews[0].film,
                        title: createdFilms[0].title
                    },
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                });
                expect(res.body).toContainEqual({
                    _id: createdReviews[1]._id,
                    rating: createdReviews[1].rating,
                    review: createdReviews[1].review,
                    film: {
                        _id: createdReviews[1].film,
                        title: createdFilms[1].title
                    },
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                });
             
            });
    });

});
