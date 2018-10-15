const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Studio route', () => {
   
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
                expect(res.body).toContainEqual(createdStudios[2]);
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/api/studios/${createdStudios[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(createdStudios[1]);
            });

    });

    it('deletes a studio by id', () => {
        return request(app)
            .delete(`/api/studios/${createdStudios[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
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




