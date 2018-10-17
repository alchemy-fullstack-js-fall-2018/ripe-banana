const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createActors, createStudios } = require('./helpers');

describe('actors', () => {
    
    let createdActors;
    let createdFilms;
    let createdStudios;

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    beforeEach(() => {
        return Promise.all([
            dropCollection('actors'),
            dropCollection('films'),
            dropCollection('studios')
        ]);
    });

    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
            });
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
            });
    });

    beforeEach(() => {
        let films = [
            {
                title: 'The Programinator',
                studio: createdStudios[0]._id,
                released: 1984,
                cast: [
                    { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                    { role: 'Sidekick', actor: createdActors[1]._id }
                ]
            },
            {
                title: 'Thelma and Luigi',
                studio: createdStudios[0]._id,
                released: 1972,
                cast: [
                    { role: 'Thelma', actor: createdActors[1]._id }, 
                    { role: 'Luigi', actor: createdActors[0]._id }
                ]
            }
        ];
        
        return Promise.all(films.map(createFilm))
            .then(filmsRes => { createdFilms = filmsRes;});
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
                expect(retrievedActor.body).toEqual({
                    name: createdActors[0].name,
                    dob: createdActors[0].dob,
                    pob: createdActors[0].pob,
                    films: [
                        {
                            _id: createdFilms[0]._id,
                            title: createdFilms[0].title,
                            released: createdFilms[0].released
                        },
                        {
                            _id: createdFilms[1]._id,
                            title: createdFilms[1].title,
                            released: createdFilms[1].released
                        }
                    ]
                });
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
