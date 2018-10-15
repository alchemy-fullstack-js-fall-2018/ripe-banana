require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('film pub/sub API', () => {
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
    let studios = [
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        },
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        },
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        }
    ];

    let films = [
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        },
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        },
        {
            title: chance.word(),
            released: chance.natural({ min: 1800, max: 9000 }),
            cast: [{
                role: chance.word()
            }]
        }
    ];

    const createActor = actor => {
        return request(app)
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    };

    const createStudio = studio => {
        return request(app)
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('studios');
    });


    beforeEach(() => {
        return Promise.all(actors.map(createActor))
            .then(actorRes => createdActors = actorRes);
    });
    beforeEach(() => {
        return Promise.all(studios.map(createStudio))
            .then(studioRes => createdStudios = studioRes);
    });




    let createdActors;
    let createdStudios;
    let createdFilms;

    it('creates a film', () => {
        return request(app)
            .post('/api/films')
            .send({
                title: 'Hot Pursuit',
                studio: createdStudios[0]._id,
                released: 2015,
                cast: [{
                    role: 'Cop',
                    actor: createdActors[0]._id
                }]
            });
    });




});
