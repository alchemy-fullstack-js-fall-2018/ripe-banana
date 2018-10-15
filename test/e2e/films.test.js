const app = require('../../lib/app');
const request = require('supertest');
const { dropCollection } = require('./db');

describe('film routes', () => {

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

    let studio = {
        name: 'Portland Studios',
        address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
        }
    };

    const createActor = actor => {
        return request(app)
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    };

    const createStudio = studio => {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    };

    let createdActors;
    let createdStudio;

    beforeEach(() => {
        return Promise.all([
            dropCollection('studios'),
            dropCollection('actors')
        ]);
    });
    
    beforeEach(() => {
        return createStudio(studio)
            .then(result => {
                createdStudio = result;
            });
    });

    beforeEach(() => {
        return Promise.all(actors.map(createActor))
            .then(actorsRes => { createdActors = actorsRes;});
    });
    
    it('creates a film', () => {
        const newFilm = {
            title: 'Revenge of the Programmers',
            studio: createdStudio._id,
            released: 1985,
            cast: [
                { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                { role: 'Sidekick', actor: createdActors[1]._id }
            ]
        };
        return request(app)
            .post('/films')
            .send(newFilm)
            .then(result => {
                expect(result.body).toEqual({
                    title: 'Revenge of the Programmers',
                    studio: createdStudio._id,
                    released: 1985,
                    cast: [
                        { _id: expect.any(String), role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                        { _id: expect.any(String), role: 'Sidekick', actor: createdActors[1]._id }
                    ],
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

});
