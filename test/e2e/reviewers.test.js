const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Reviewer route', () => {
   
    let reviewers =  [{
        name: 'CreatedReviewer1', 
        company: 'CreatedCompany1'
    },
    {
        name: 'CreatedReviewer2', 
        company: 'CreatedCompany2'

    },
    {
        name: 'CreatedReviewer3', 
        company: 'CreatedCompany3'

    }
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
        return Promise.all(reviewers.map(createReviewer)).then(reviewersRes => {
            createdReviewers = reviewersRes;
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
                expect(res.body).toContainEqual(createdReviewers[0]);
                expect(res.body).toContainEqual(createdReviewers[1]);
                expect(res.body).toContainEqual(createdReviewers[2]);
            });
    });

    it('gets a Reviewer by id', () => {
        return request(app)
            .get(`/api/reviewers/${createdReviewers[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(createdReviewers[1]);
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




