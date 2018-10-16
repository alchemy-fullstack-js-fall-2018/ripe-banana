const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Films route', () => {
    beforeEach(() => {
        return dropCollection('studios');
    });
    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('films');
    });

    let createdActors;
    let createdStudios;
    let createdFilms;

    let actors =  [{
        name: 'Anna Peel',
        dob: new Date(),
        pob: 'Brazil'
    },
    {
        name: 'Lud Orange',
        dob: new Date(),
        pob: 'Florida'
    }];
    
    let studios =  [{
        name: 'Compost Cinema', 
        address: {
            city: 'Portland',
            state: 'OR',
            country: 'United States'
        }
    },
    {
        name: 'Compost Cinema2', 
        address: {
            city: 'Portland2',
            state: 'OR',
            country: 'United States'
        }
    }];

    let films =  [{
        title: 'Bladecrawler',
        released: 1991,
        cast: [{
            role: 'lead',
        }]
    },
    {
        title: 'Bladewalker',
        released: 1992,
        cast: [{
            role: 'Deckard',
        }]
    }];
        
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

    beforeEach(() => {
        return Promise.all(actors.map(createActor)).then(actorsRes => {
            createdActors = actorsRes;
            films[0].cast[0].actor = createdActors[0]._id;
            films[1].cast[0].actor = createdActors[1]._id;
        });
    });

    beforeEach(() => {
        return Promise.all(studios.map(createStudio)).then(studiosRes => {
            createdStudios = studiosRes;
            films[0].studio = createdStudios[0]._id;
            films[1].studio = createdStudios[1]._id;
        });
    });
        
    beforeEach(() => {
        return Promise.all(films.map(createFilm)).then(filmsRes => {
            createdFilms = filmsRes;
        });
    });

    it('Posts to Films', () => {
        return request(app)
            .post('/api/films')
            .send({
                title: 'Bladewalker',
                studio: createdStudios[0]._id,
                released: 1991,
                cast: [{
                    role: 'Pris',
                    actor: createdActors[0]._id
                }]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    title: 'Bladewalker',
                    studio: createdStudios[0]._id,
                    released: 1991,
                    cast: [{
                        _id: expect.any(String),
                        role: 'Pris',
                        actor: createdActors[0]._id
                    }]
                });            
            });
    });
    
    it('gets all Films', () => {
        return request(app)
            .get('/api/films')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdFilms[0]._id,
                    title: createdFilms[0].title, 
                    released: createdFilms[0].released, 
                    studio: { 
                        _id: createdFilms[0].studio, 
                        name: createdStudios[0].name 
                    }
                });
                expect(res.body).toContainEqual({
                    _id: createdFilms[1]._id,
                    title: createdFilms[1].title, 
                    released: createdFilms[1].released, 
                    studio: { 
                        _id: createdFilms[1].studio, 
                        name: createdStudios[1].name 
                    }
                });
            });
    });

    it('gets a film by id', () => {
        return request(app)
            .get(`/api/films/${createdFilms[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(
                    { 
                        title: createdFilms[1].title, 
                        released: createdFilms[1].released, 
                        studio: { 
                            _id: createdFilms[1].studio, 
                            name: createdStudios[1].name 
                        }, 
                        cast: [{
                            _id: createdFilms[1].cast[0]._id, 
                            role: createdFilms[1].cast[0].role, 
                            actor: {
                                _id: createdActors[1]._id, 
                                name: createdActors[1].name 
                            }
                        }] 
                    });
            });
    });

    it('deletes a film by id', () => {
        return request(app)
            .delete(`/api/films/${createdFilms[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

});
