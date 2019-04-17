const request = require('supertest');
const app = require('../../lib/app');
const { getActors, getFilms } = require('./helpers');

describe('validates a vertical slice of the Actor route', () => {
    it('Posts to Actor', () => {
        return request(app)
            .post('/api/actors')
            .send({
                name: 'Anna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Anna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });
            });
    });

    it('gets all Actors', () => {
        const createdActors = getActors();
        return request(app)
            .get('/api/actors')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdActors[0]._id,
                    name: createdActors[0].name
                });
                expect(res.body).toContainEqual({
                    _id: createdActors[1]._id,
                    name: createdActors[1].name
                });
            });
    });

    it('gets a actor by id', () => {
        const createdActors = getActors();
        const createdFilms = getFilms();
        return request(app)
            .get(`/api/actors/${createdActors[1]._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    name: createdActors[1].name,
                    dob: createdActors[1].dob,
                    pob: createdActors[1].pob,
                    films: [
                        {
                            _id: createdFilms[1]._id,
                            title: createdFilms[1].title,
                            released: createdFilms[1].released
                        }
                    ]
                });
            });
    });

    it('deletes a actor that is not in any film casts', () => {
        const createdActors = getActors();
        return request(app)
            .delete(`/api/actors/${createdActors[2]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('responds with an error when asked to delete an actor referenced in a film', () => {
        const createdActors = getActors();
        return request(app)
            .delete(`/api/actors/${createdActors[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({
                    Error: 'Cannot remove an actor referenced in a film'
                });
            });
    });

    it('updates a actor by id', () => {
        const createdActors = getActors();
        return request(app)
            .put(`/api/actors/${createdActors[1]._id}`)
            .send({
                name: 'Ananna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Ananna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });
            });
    });
});
