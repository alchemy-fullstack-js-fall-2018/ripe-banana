const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Studio route', () => {
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
    },
    {
        name: 'Compost Budget Cinema', 
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



    it('Posts to Studio', () => {
        return request(app)
            .post('/api/studios')
            .send({
                name: 'Compost Cinema', 
                address: {
                    city: 'Portland',
                    state: 'OR',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Compost Cinema',
                    address: {
                        city: 'Portland',
                        state: 'OR',
                        country: 'United States'
                    }
                });            
            });
    });

    it('gets all Studios', () => {
        return request(app)
            .get('/api/studios')
            .then(res => {
                expect(res.body).toContainEqual(createdStudios[0]);
                expect(res.body).toContainEqual(createdStudios[1]);
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/api/studios/${createdStudios[1]._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: createdStudios[1]._id,
                    name: createdStudios[1].name,
                    address: createdStudios[1].address,
                    films: [{
                        _id: createdFilms[1]._id,
                        title: createdFilms[1].title
                    }]
                });
            });

    });

    it('deletes a studio by id', () => {
        return request(app)
            .delete(`/api/studios/${createdStudios[2]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('responds with an error when asked to delete a studio referenced in a film', () => {
        return request(app)
            .delete(`/api/studios/${createdStudios[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ Error: 'Cannot remove a studio referenced in a film' });
            });
    });

    it('updates a studio by id', () => {
        return request(app)
            .put(`/api/studios/${createdStudios[1]._id}`)
            .send({
                name: 'Compost Cinema5', 
                address: {
                    city: 'Portland5',
                    state: 'OR',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Compost Cinema5', 
                    address: {
                        city: 'Portland5',
                        state: 'OR',
                        country: 'United States'
                    }
                });
            });
    });

});




