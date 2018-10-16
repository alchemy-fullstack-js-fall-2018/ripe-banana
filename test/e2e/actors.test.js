const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createActors } = require('./helpers');

describe('actors', () => {

    beforeEach(() => {
        return dropCollection('actors');
    });

    let createdActors;
    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });


    it('creates an actor', () => {
        const newActor = {
            name: 'Sir Clancy Yorkshire IV',
            dob: '1934-12-12T08:00:00.000Z',
            pob: 'New Jersey'
        };
        return request(app)
            .post('/actors')
            .send(newActor)
            .then(result => {
                expect(result.body).toEqual({
                    ...newActor,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

    it('retrieve all actors on get request', () => {
        return request(app)
            .get('/actors')
            .then(retrievedActors => {
                createdActors.forEach(createdActor => {
                    expect(retrievedActors.body).toContainEqual(createdActor);
                });
            });
    });

    it('retrieves one actor by id', () => {
        const id = createdActors[0]._id;
        return request(app)
            .get(`/actors/${id}`)
            .then(retrievedActor => {
                expect(retrievedActor.body).toEqual(createdActors[0]);
            });

    });

    it('deleted one actor by id', () => {
        const id = createdActors[0]._id;
        return request(app)
            .delete(`/actors/${id}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });

    it('tries to delete one actor by id and returns false when supplied a bogus id', () => {
        const bogusId = '123456789012345678901234';
        return request(app)
            .delete(`/actors/${bogusId}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

    it('updates an actor when supplied id and new data', () => {
        const id = createdActors[0]._id;
        const newData = createdActors[0];
        newData.name = 'Neil Damon';
        return request(app)
            .put(`/actors/${id}`)
            .send(newData)
            .then(result => {
                expect(result.body).toEqual(newData);
            });
    });



});
