const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

describe('actors', () => {

    let actors = [
        {
            name: 'Matt Diamond',
            dob: new Date('11-11-1911'),
            pob: 'Sweden'
        },
        {
            name: 'Susan Surandin',
            dob: new Date('04-14-1985'),
            pob: 'Miami'
        }
    ];

    let createdActors;
    
    const createActor = actor => {
        return request(app)
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('actors');
    });

    beforeEach(() => {
        return Promise.all(actors.map(createActor))
            .then(actorsRes => { createdActors = actorsRes;});
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
        return request(app)
            .get(`/actors/${createdActors[0]._id}`)
            .then(retrievedActor => {
                expect(retrievedActor.body).toEqual(createdActors[0]);
            });

    });

    it('deleted one actor by id', () => {
        return request(app)
            .delete(`/actors/${createdActors[0]._id}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });



});
