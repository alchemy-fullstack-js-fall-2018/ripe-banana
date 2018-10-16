const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Actor route', () => {

    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('films');
    });

    let createdActors;
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
    },
    {
        name: 'Ocado Pitt',
        dob: new Date(),
        pob: 'Mexico'
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
        return Promise.all(films.map(createFilm)).then(filmsRes => {
            createdFilms = filmsRes;
        });
    });


    it('Posts to Actor', () => {
        return request(app)
            .post('/api/actors')
            .send({
                name: 'Anna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Anna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });            
            });
    });

    it('gets all Actors', () => {
        return request(app)
            .get('/api/actors')
            .then(res => {
                expect(res.body).toContainEqual({ _id: createdActors[0]._id, name: createdActors[0].name });
                expect(res.body).toContainEqual({ _id: createdActors[1]._id, name: createdActors[1].name });
                expect(res.body).toContainEqual({ _id: createdActors[2]._id, name: createdActors[2].name });
            });
    });

    it('gets a actor by id', () => {
        return request(app)
            .get(`/api/actors/${createdActors[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(
                    {
                        name: createdActors[1].name,
                        dob: createdActors[1].dob,
                        pob: createdActors[1].pob,
                        films: [{
                            _id: createdFilms[1]._id,
                            title: createdFilms[1].title,
                            released: createdFilms[1].released
                        }]
                    });
            });
    });

    it('deletes a actor that is not in any film casts', () => {
        return request(app)
            .delete(`/api/actors/${createdActors[2]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('responds with an error when asked to delete an actor referenced in a film', () => {
        return request(app)
            .delete(`/api/actors/${createdActors[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ Error: 'Cannot remove an actor referenced in a film' });
            });
    });

    it('updates a actor by id', () => {
        return request(app)
            .put(`/api/actors/${createdActors[1]._id}`)
            .send({
                name: 'Ananna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Ananna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });            
            });
    });
});
