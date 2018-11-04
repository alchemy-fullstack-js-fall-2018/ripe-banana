const request = require('supertest');
const app = require('../../lib/app');
require('./db');
const { getReviewers, getReviewerTokens, getActors, getStudios, getFilms, getReviews } = require('./created');

describe('studios', () => {
   
    it('creates a studio if user is an admin', () => {
        const reviewerTokens = getReviewerTokens();

        const newStudio = {
            name: 'Laika',
            address: {
                city: 'Hillsboro',
                state: 'OR',
                country: 'USA'
            }
        };
        return request(app)
            .post('/studios')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(newStudio)
            .then(result => {
                expect(result.body).toEqual({
                    ...newStudio,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

    it('won\'t create a studio if user is not an admin', () => {
        const reviewerTokens = getReviewerTokens();

        const newStudio = {
            name: 'Laika',
            address: {
                city: 'Hillsboro',
                state: 'OR',
                country: 'USA'
            }
        };
        return request(app)
            .post('/studios')
            .set('Authorization', `Bearer ${reviewerTokens[1]}`)
            .send(newStudio)
            .then(result => {
                expect(result.body).toEqual({});
            });
    });

    it('retrieves all studios on get request', () => {
        const studios = getStudios();

        return request(app)
            .get('/studios')
            .then(retrievedStudios => {
                studios.forEach(studio => {
                    expect(retrievedStudios.body).toContainEqual(studio);
                });
            });
    });

    it('retrieves one studio by id', () => {
        const studios = getStudios();
        const films = getFilms();

        return request(app)
            .get(`/studios/${studios[0]._id}`)
            .then(retrievedStudio => {
                expect(retrievedStudio.body).toEqual({ 
                    _id: studios[0]._id,
                    name: studios[0].name,
                    address: studios[0].address, 
                    films:[
                        { _id: films[0]._id, title: films[0].title },
                        { _id: films[1]._id, title: films[1].title }
                    ] 
                });
            });

    });

    it('deletes one studio by id if no films', () => {
        const studios = getStudios();
        const reviewerTokens = getReviewerTokens();

        return request(app)
            .delete(`/studios/${studios[2]._id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });

    it('does not delete one studio by id if has films', () => {
        const studios = getStudios();
        const reviewerTokens = getReviewerTokens();

        return request(app)
            .delete(`/studios/${studios[0]._id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

    it('tries to delete one studio by id and returns false when supplied a bogus id', () => {
        const bogusId = '123456789012345678901234';
        const reviewerTokens = getReviewerTokens();

        return request(app)
            .delete(`/studios/${bogusId}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

});


