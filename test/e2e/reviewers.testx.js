const request = require('supertest');
const app = require('../../lib/app');
const { getReviewers, getReviews, getFilms } = require('./helpers');

describe('validates a vertical slice of the Reviewer route', () => {
   
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
        const createdReviewers = getReviewers();

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
        const createdReviewers = getReviewers();
        const createdFilms = getFilms();
        const createdReviews = getReviews();

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
        const createdReviewers = getReviewers();

        return request(app)
            .delete(`/api/reviewers/${createdReviewers[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('updates a Reviewer by id', () => {
        const createdReviewers = getReviewers();

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




