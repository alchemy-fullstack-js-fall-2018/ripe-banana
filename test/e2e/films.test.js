const request = require('supertest');
const app = require('../../lib/app');
const { getReviewers, getReviews, getActors, getFilms, getStudios } = require('./helpers');

describe('validates a vertical slice of the Films route', () => {

    it('Posts to Films', () => {
        const createdStudios = getStudios();
        const createdActors = getActors();

        return request(app)
            .post('/api/films')
            .send({
                title: 'Bladewalker',
                studio: createdStudios[0]._id,
                released: 1991,
                cast: [{
                    role: 'Pris',
                    actor: createdActors[0]._id
                }]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    title: 'Bladewalker',
                    studio: createdStudios[0]._id,
                    released: 1991,
                    cast: [{
                        _id: expect.any(String),
                        role: 'Pris',
                        actor: createdActors[0]._id
                    }]
                });            
            });
    });
    
    it('gets all Films', () => {
        const createdFilms = getFilms();
        const createdStudios = getStudios();

        return request(app)
            .get('/api/films')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdFilms[0]._id,
                    title: createdFilms[0].title, 
                    released: createdFilms[0].released, 
                    studio: { 
                        _id: createdFilms[0].studio, 
                        name: createdStudios[0].name 
                    }
                });
                expect(res.body).toContainEqual({
                    _id: createdFilms[1]._id,
                    title: createdFilms[1].title, 
                    released: createdFilms[1].released, 
                    studio: { 
                        _id: createdFilms[1].studio, 
                        name: createdStudios[1].name 
                    }
                });
            });
    });

    it('gets a film by id', () => {
        const createdFilms = getFilms();
        const createdStudios = getStudios();
        const createdActors = getActors();
        const createdReviews = getReviews();
        const createdReviewers = getReviewers();

        return request(app)
            .get(`/api/films/${createdFilms[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(
                    { 
                        title: createdFilms[1].title, 
                        released: createdFilms[1].released, 
                        studio: { 
                            _id: createdFilms[1].studio, 
                            name: createdStudios[1].name 
                        }, 
                        cast: [{
                            _id: createdFilms[1].cast[0]._id, 
                            role: createdFilms[1].cast[0].role, 
                            actor: {
                                _id: createdActors[1]._id, 
                                name: createdActors[1].name 
                            }
                        }],
                        reviews: [{
                            _id: createdReviews[1].film,
                            rating: createdReviews[1].rating,
                            review: createdReviews[1].review,
                            reviewer: [{
                                _id: createdReviews[1].reviewer,
                                name: createdReviewers[1].name
                            }]
                        }] 
                    });
            });
    });

    it('deletes a film by id', () => {
        const createdFilms = getFilms();

        return request(app)
            .delete(`/api/films/${createdFilms[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

});
