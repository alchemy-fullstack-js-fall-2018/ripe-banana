require('dotenv').config();
const { dropCollection } = require('../util/db');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const request = require('supertest');

describe('actors pub/sub API', () => {
    let actors = [
        {
            name: chance.name({ suffix: true }),
            dob: chance.date(),
            pob: chance.word()
        },
        {
            name: chance.name({ suffix: true }),
            dob: chance.date(),
            pob: chance.word()
        },
        {
            name: chance.name({ prefix: true }),
            dob: chance.date(),
            pob: chance.word()
        },

    ];

    let createdActors;

    const createActor = actor => {
        return request(app)
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('actors');
    });

    beforeEach(() => {
        return Promise.all(actors.map(createActor))
            .then(actorRes => createdActors = actorRes);
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
});
