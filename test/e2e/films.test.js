const app = require('../../lib/app');
const request = require('supertest');
require('./db');
const { getReviewers, getReviewerTokens, getActors, getStudios, getFilms, getReviews } = require('./created');

describe('film routes', () => {
    
    it('creates a film if you are an admin', () => {
        const reviewerTokens = getReviewerTokens();
        const studios = getStudios();
        const actors = getActors();

        const newFilm = {
            title: 'Revenge of the Programmers',
            studio: studios[0]._id,
            released: 1985,
            cast: [
                { role: 'Chief Troublemaker', actor: actors[0]._id }, 
                { role: 'Sidekick', actor: actors[1]._id }
            ]
        };
        return request(app)
            .post('/films')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(newFilm)
            .then(result => {
                expect(result.body).toEqual({
                    title: 'Revenge of the Programmers',
                    studio: studios[0]._id,
                    released: 1985,
                    cast: [
                        { _id: expect.any(String), role: 'Chief Troublemaker', actor: actors[0]._id }, 
                        { _id: expect.any(String), role: 'Sidekick', actor: actors[1]._id }
                    ],
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('won\'t create a film if you are not an admin', () => {
        const reviewerTokens = getReviewerTokens();
        const studios = getStudios();
        const actors = getActors();

        const newFilm = {
            title: 'Revenge of the Programmers',
            studio: studios[0]._id,
            released: 1985,
            cast: [
                { role: 'Chief Troublemaker', actor: actors[0]._id }, 
                { role: 'Sidekick', actor: actors[1]._id }
            ]
        };
        return request(app)
            .post('/films')
            .set('Authorization', `Bearer ${reviewerTokens[1]}`)
            .send(newFilm)
            .then(result => {
                expect(result.body).toEqual({});
            });
    });

    it('gets all films', () => {
        const films = getFilms();
        const studios = getStudios();

        return request(app)
            .get('/films')
            .then(retrievedFilms => {
                films.forEach(film => {
                    expect(retrievedFilms.body).toContainEqual(
                        {
                            title: film.title,
                            released: film.released,
                            studio: { 
                                _id: studios[0]._id,
                                name: studios[0].name
                            },
                            _id: expect.any(String)
                        } 
                    );
                });
            });
    });

    it('gets a film when supplied film id', () =>{
        const films = getFilms();
        const studios = getStudios();
        const actors = getActors();
        const reviews = getReviews();
        const reviewers = getReviewers();

        const id = films[0]._id;
        return request(app)
            .get(`/films/${id}`)
            .then(returnedFilm => {
                expect(returnedFilm.body).toEqual({
                    title: films[0].title,
                    released: films[0].released,
                    studio: {
                        _id: studios[0]._id,
                        name: studios[0].name
                    },
                    cast: [
                        { 
                            _id: expect.any(String), 
                            role: 'Chief Troublemaker', 
                            actor: {
                                _id: actors[0]._id,
                                name: actors[0].name 
                            }
                        },
                        { 
                            _id: expect.any(String), 
                            role: 'Sidekick', 
                            actor: {
                                _id: actors[1]._id,
                                name: actors[1].name 
                            }
                        }
                    ],
                    reviews: [{
                        _id: reviews[0]._id,
                        rating: reviews[0].rating,
                        text: reviews[0].text, 
                        reviewer: {
                            _id: reviewers[0]._id,
                            name: reviewers[0].name
                        }
                    }]                 
                });
            }); 
    });

    it('deletes a film by id if you are an admin', () => {
        const reviewerTokens = getReviewerTokens();
        const films = getFilms();
        const id = films[0]._id;
        return request(app)
            .delete(`/films/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });

    it('won\'t delete a film by id if you are not an admin', () => {
        const films = getFilms();
        const reviewerTokens = getReviewerTokens();
        const id = films[0]._id;
        return request(app)
            .delete(`/films/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[1]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({});
            });
    });

});
