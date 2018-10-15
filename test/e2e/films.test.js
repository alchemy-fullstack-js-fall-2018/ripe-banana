const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Studio route', () => {
    
    // Creating actors for tests

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
        return Promise.all(actors.map(createActor)).then(actorsRes => {
            createdActors = actorsRes;
        });
    });

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
        name: 'Compost Cinema3', 
        address: {
            city: 'Portland3',
            state: 'OR',
            country: 'United States'
        }
    },
    ];
    
    let createdStudios;
        
    const createStudio = studio => {
        return request(app)
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);
    };
        
    beforeEach(() => {
        return dropCollection('studios');
    });
        
    beforeEach(() => {
        return Promise.all(studios.map(createStudio)).then(studiosRes => {
            createdStudios = studiosRes;
        });
    });

    if(createdStudios && createdActors){
        let films =  [{
            title: 'Bladecrawler',
                studio: createdStudios[0]._id,
                released: 1991,
                cast: [{
                    role: 'lead',
                    actor: createdActors[0]._id
                }]
        },
        {
            title: 'Bladewalker',
            studio: createdStudios[1]._id,
            released: 1992,
            cast: [{
                role: 'Deckard',
                actor: createdActors[1]._id
            }]
        }];
        
        let createdFilms;
            
        const createFilm = film => {
            return request(app)
                .post('/api/films')
                .send(film)
                .then(res => res.body);
        };
            
        beforeEach(() => {
            return dropCollection('films');
        });
            
        beforeEach(() => {
            return Promise.all(films.map(createFilm)).then(filmsRes => {
                createdFilms = filmsRes;
            });
        });
    }


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
                console.log('@@response', res.body)
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

    // it('gets all Studios', () => {
    //     return request(app)
    //         .get('/api/studios')
    //         .then(res => {
    //             expect(res.body).toContainEqual(createdStudios[0]);
    //             expect(res.body).toContainEqual(createdStudios[1]);
    //             expect(res.body).toContainEqual(createdStudios[2]);
    //         });
    // });

    // it('gets a studio by id', () => {
    //     return request(app)
    //         .get(`/api/studios/${createdStudios[1]._id}`)
    //         .then(res => {
    //             expect(res.body).toEqual(createdStudios[1]);
    //         });

    // });

    // it('deletes a studio by id', () => {
    //     return request(app)
    //         .delete(`/api/studios/${createdStudios[1]._id}`)
    //         .then(modifiedList => {
    //             expect(modifiedList.body).toEqual({ removed: true });
    //         });
    // });

    // it('updates a studio by id', () => {
    //     return request(app)
    //         .put(`/api/studios/${createdStudios[1]._id}`)
    //         .send({
    //             name: 'Compost Cinema5', 
    //             address: {
    //                 city: 'Portland5',
    //                 state: 'OR',
    //                 country: 'United States'
    //             }
    //         })
    //         .then(res => {
    //             expect(res.body).toEqual({
    //                 _id: expect.any(String),
    //                 __v: expect.any(Number),
    //                 name: 'Compost Cinema5', 
    //                 address: {
    //                     city: 'Portland5',
    //                     state: 'OR',
    //                     country: 'United States'
    //                 }
    //             });
    //         });
    // });

});
