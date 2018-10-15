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

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    let createdActors;
    let createdStudio;
    let createdFilms;

    beforeEach(() => {
        return Promise.all([
            dropCollection('studios'),
            dropCollection('actors'),
            dropCollection('films')
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

    
    beforeEach(() => {
        let films = [
            {
                title: 'The Programinator',
                studio: createdStudio._id,
                released: 1984,
                cast: [
                    { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
                    { role: 'Sidekick', actor: createdActors[1]._id }
                ]
            },
            {
                title: 'Thelma and Luigi',
                studio: createdStudio._id,
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

    it('gets all films', () => {
        return request(app)
            .get('/films')
            .then(retrievedFilms => {
                createdFilms.forEach(createdFilm => {
                    expect(retrievedFilms.body).toContainEqual(
                        {
                            title: createdFilm.title,
                            released: createdFilm.released,
                            studio: { 
                                _id: createdStudio._id,
                                name: createdStudio.name
                            },
                            _id: expect.any(String)
                        } 
                    );
                });
            });
    });

    it('gets a film when supplied film id', () =>{
        const id = createdFilms[0]._id;
        return request(app)
            .get(`/films/${id}`)
            .then(returnedFilm => {
                expect(returnedFilm.body).toEqual({
                    title: createdFilms[0].title,
                    released: createdFilms[0].released,
                    studio: {
                        _id: createdStudio._id,
                        name: createdStudio.name
                    },
                    cast: [
                        { 
                            _id: expect.any(String), 
                            role: 'Chief Troublemaker', 
                            actor: {
                                _id: createdActors[0]._id,
                                name: createdActors[0].name 
                            }
                        },
                        { 
                            _id: expect.any(String), 
                            role: 'Sidekick', 
                            actor: {
                                _id: createdActors[1]._id,
                                name: createdActors[1].name 
                            }
                        }

                    ]                 
                });
            });
        
    });

});
