require('dotenv').config();
const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe.skip('film pub/sub API', () => {
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
    
    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('studios');
    });

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

    const createFilm = film => {
        return request(app)
            .post('/api/films')
            .send(film)
            .then(res => res.body);
    };
        
    let createdActors;
    let createdStudios;
    let createdFilms;
        
    beforeEach(() => {
        return Promise.all(actors.map(createActor))
            .then(actorRes => {
                createdActors = actorRes;
                createdActors.forEach((actor, index) => {
                    films[index].cast[0].actor = actor._id;
                });
            });
    });
    
    beforeEach(() => {
        return Promise.all(studios.map(createStudio))
            .then(studioRes => {
                createdStudios = studioRes;
                createdStudios.forEach((studio, index) => {
                    films[index].studio = studio._id;
                });
            });
    });

    beforeEach(() => {
        return Promise.all(films.map(createFilm))
            .then(filmRes => createdFilms = filmRes);
    });

    it('creates a film', () => {
        return request(app)
            .post('/api/films')
            .send(films[0])
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    ...films[0]
                });
            }); 
    });

    it('gets all films', () => {
        return request(app)
            .get('/api/films')
            .then(retrievedFilms => {
                createdFilms.forEach(() => {
                    expect(retrievedFilms.body).toContainEqual({
                        title: createdFilms[0].title,
                        studio: { _id: createdFilms[0].studio, name: createdStudios[0].name },
                        released: createdFilms[0].released,
                        _id: expect.any(String)
                    });
                });
            });
    });

    it('gets a film by id', () => {
        return request(app)
            .get(`/api/films/${createdFilms[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: createdFilms[0]._id,
                    title: createdFilms[0].title,
                    released: createdFilms[0].released,
                    studio: { _id: createdFilms[0].studio, name: createdStudios[0].name },
                    cast: [{
                        _id: createdFilms[0].cast[0]._id,
                        role: createdFilms[0].cast[0].role,
                        actor: {
                            _id: createdActors[0]._id,
                            name: createdActors[0].name
                        }
                    }]  
                });
            });
    });

    it('deletes a film', () => {
        return request(app)
            .delete(`/api/films/${createdFilms[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ removed: true });
            });
    });

    




});
