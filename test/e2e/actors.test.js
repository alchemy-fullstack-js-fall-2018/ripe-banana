require('dotenv').config();
const { dropCollection } = require('../util/db');
const app = require('../../lib/app');
const request = require('supertest');
const { createActors, createFilms } = require('../util/helpers');

describe('actors pub/sub API', () => {
    
    beforeEach(() => {
        return dropCollection('actors');
    });

    let createdActors;
    beforeEach(() => {
        createdActors = [];
        return createActors(2, createdActors);
    });

    let createdFilms;
    beforeEach(() => {
        createdFilms = [];
        return createFilms(2, createdFilms);
    });

    it('creates an actor on post', () => {
        return request(app)
            .post('/api/actors')
            .send({
                name: 'Ingrid Bergman',
                dob: '1915-08-29T07:00:00.000Z',
                pob: 'Stockholm, Sweden'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Ingrid Bergman',
                    dob: '1915-08-29T07:00:00.000Z',
                    pob: 'Stockholm, Sweden'
                });
            });
    });

    it('gets all actors on get', () => {
        return request(app)
            .get('/api/actors')
            .then(retrievedActors => {
                createdActors.forEach(createdActor => {
                    expect(retrievedActors.body).toContainEqual({ _id: createdActor._id, name: createdActor.name });
                });
            });
    });

    it('gets an actor by id', () => {
        return request(app)
            .get(`/api/actors/${createdActors[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdActors[0], __v: expect.any(Number), films: [] });
            });     
    });

    it('gets an actor by id with films', () => {
        return request(app)
            .get(`/api/actors/${createdFilms[0].cast[0].actor}`)
            .then(res => {
                expect(res.body.films).toEqual([{ 
                    _id: createdFilms[0]._id, 
                    title: createdFilms[0].title, 
                    released: createdFilms[0].released 
                }]);
            });
    });

    it('updates an actor by id', () => {
        return request(app)
            .put(`/api/actors/${createdActors[0]._id}`)
            .send({ name: 'Idris Elba' })
            .then(res => {
                expect(res.body).toEqual({ ...createdActors[0], name: 'Idris Elba' });
            });
    });

    it('deletes an actor by id', () => {
        return request(app)
            .delete(`/api/actors/${createdActors[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ removed: true });
            });
    });

    it('does not delete actor if there are films associated with them', () => {
        return request(app)
            .delete(`/api/actors/${createdFilms[0].cast[0].actor}`)
            .then(res => {
                expect(res.body).toEqual({ removed: false });
            });
    });

});
