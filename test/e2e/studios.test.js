const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createStudios, createActors } = require('./helpers');

describe('studio', () => {

    let createdStudios;
    let createdFilms;
    let createdActors;

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };
    
    beforeEach(() => {
        return Promise.all([
            dropCollection('studios'),
            dropCollection('films'),
            dropCollection('actors')
        ]);
    });

    beforeEach(() => {
        return createStudios()
            .then(studiosRes => { 
                createdStudios = studiosRes;
            });
    });

    beforeEach(() => {
        return createActors()
            .then(actorsRes => { 
                createdActors = actorsRes;
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
   
    it('creates a studio', () => {
        const newStudio = {
            name: 'Laika',
            address: {
                city: 'Hillsboro',
                state: 'OR',
                country: 'USA'
            }
        };
        return request(app)
            .post('/studios')
            .send(newStudio)
            .then(result => {
                expect(result.body).toEqual({
                    ...newStudio,
                    __v: expect.any(Number),
                    _id: expect.any(String)
                });
            });
    });

    it('retrieve all studios on get request', () => {
        return request(app)
            .get('/studios')
            .then(retrievedStudios => {
                createdStudios.forEach(createdStudio => {
                    expect(retrievedStudios.body).toContainEqual(createdStudio);
                });
            });
    });

    it('retrieves one studio by id', () => {
        return request(app)
            .get(`/studios/${createdStudios[0]._id}`)
            .then(retrievedStudio => {
                expect(retrievedStudio.body).toEqual({ 
                    _id: createdStudios[0]._id,
                    name: createdStudios[0].name,
                    address: createdStudios[0].address, 
                    films:[
                        { _id: createdFilms[0]._id, title: createdFilms[0].title },
                        { _id: createdFilms[1]._id, title: createdFilms[1].title }
                    ] 
                });
            });

    });

    it('deletes one studio by id if no films', () => {
        return request(app)
            .delete(`/studios/${createdStudios[2]._id}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
            });
    });

    it('does not delete one studio by id if has films', () => {
        return request(app)
            .delete(`/studios/${createdStudios[0]._id}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

    it('tries to delete one studio by id and returns false when supplied a bogus id', () => {
        const bogusId = '123456789012345678901234';
        return request(app)
            .delete(`/studios/${bogusId}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: false });
            });
    });

});


