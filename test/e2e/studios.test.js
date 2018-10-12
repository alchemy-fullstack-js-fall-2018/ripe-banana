const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

describe('studio', () => {

    let studios = [
        {
            name: 'YuraqYana Studios',
            address: {
                city: 'Lima',
                state: 'Lima',
                country: 'Peru'
            }
        },
        {
            name: 'Pixar',
            address: {
                city: 'Palo Alto',
                state: 'CA',
                country: 'USA'
            }
        }
    ];

    let createdStudios;
    
    const createStudio = studio => {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return Promise.all(studios.map(createStudio))
            .then(studiosRes => { createdStudios = studiosRes });
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
                expect(retrievedStudio.body).toEqual(createdStudios[0]);
            });

    });

    it('deleted one studio by id', () => {
        return request(app)
            .delete(`/studios/${createdStudios[0]._id}`)
            .then(deletedStatus => {
                expect(deletedStatus.body).toEqual({ removed: true });
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


