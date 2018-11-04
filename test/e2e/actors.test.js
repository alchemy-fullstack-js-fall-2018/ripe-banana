const request = require('supertest');
const app = require('../../lib/app');
require('./db');
const { getReviewers, getReviewerTokens, getActors, getStudios, getFilms, getReviews } = require('./created');

describe('actors', () => {

    it('creates an actor if user is an admin', () => {
        const reviewerTokens = getReviewerTokens();

        const newActor = {
            name: 'Sir Clancy Yorkshire IV',
            dob: '1934-12-12T08:00:00.000Z',
            pob: 'New Jersey'
        };
        return request(app)
            .post('/actors')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(newActor)
            .then(result => {
                expect(result.body).toEqual({
                    ...newActor,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

    it('won\'t create an actor if user is not an admin', () => {
        const reviewerTokens = getReviewerTokens();

        const newActor = {
            name: 'Sir Clancy Yorkshire IV',
            dob: '1934-12-12T08:00:00.000Z',
            pob: 'New Jersey'
        };
        return request(app)
            .post('/actors')
            .set('Authorization', `Bearer ${reviewerTokens[1]}`)
            .send(newActor)
            .then(result => {
                expect(result.body).toEqual({});
            });
    })

    it('retrieve all actors on get request', () => {
        const actors = getActors();

        return request(app)
            .get('/actors')
            .then(retrievedActors => {
                actors.forEach(actor => {
                    expect(retrievedActors.body).toContainEqual(actor);
                });
            });
    });

    it('retrieves one actor by id', () => {
        const actors = getActors();
        const films = getFilms();
        const id = actors[0]._id;

        return request(app)
            .get(`/actors/${id}`)
            .then(retrievedActor => {
                expect(retrievedActor.body).toEqual({
                    name: actors[0].name,
                    dob: actors[0].dob,
                    pob: actors[0].pob,
                    films: [
                        {
                            _id: films[0]._id,
                            title: films[0].title,
                            released: films[0].released
                        },
                        {
                            _id: films[1]._id,
                            title: films[1].title,
                            released: films[1].released
                        }
                    ]
                });
            });
    });

    it('deletes one actor by id who is not in any films (admin required)', () => {
        const reviewerTokens = getReviewerTokens();
        const actors = getActors();
        const id = actors[2]._id;

        return request(app)
            .delete(`/actors/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });

    it('does not delete one actor by id who has films', () => {
        const reviewerTokens = getReviewerTokens();
        const actors = getActors();
        const id = actors[0]._id;

        return request(app)
            .delete(`/actors/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

    it('tries to delete one actor by id and returns false when supplied a bogus id', () => {
        const reviewerTokens = getReviewerTokens();
        const bogusId = '123456789012345678901234';
        return request(app)
            .delete(`/actors/${bogusId}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

    it('updates an actor when supplied id and new data (admin required)', () => {
        const reviewerTokens = getReviewerTokens();
        const actors = getActors();
        const id = actors[0]._id;
        const newData = actors[0];
        newData.name = 'Neil Damon';
        return request(app)
            .put(`/actors/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(newData)
            .then(result => {
                expect(result.body).toEqual(newData);
            });
    });

});
