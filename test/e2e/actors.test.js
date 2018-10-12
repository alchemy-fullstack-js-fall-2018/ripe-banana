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
            dob: new Date('12-12-1934'),
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

});