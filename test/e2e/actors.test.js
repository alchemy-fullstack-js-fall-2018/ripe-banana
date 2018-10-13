require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Actor = require('../../lib/models/Actor');

let actors = [
    {
        name: 'Nicolas Cage',
        dob: 'January 7, 1964',
        pob: 'Long Beach, CA'
    },
    {
        name: 'Bradley Cooper',
        dob: 'January 5, 1975',
        pob: 'Philadelphia, PA'
    },
    {
        name: 'Fran Drescher',
        dob: 'September 30, 1957',
        pob: 'New York, NY'
    }
];

let createdActors;

const createActor = actor => {
    return request(app)
        .post('/api/actors/')
        .send(actor)
        .then(res => res.body);
};

beforeEach(() => {
    return Actor.deleteMany();
});

beforeEach(() => {
    return Promise.all(actors.map(createActor))
        .then(actorsRes => {
            createdActors = actorsRes;
        });
});

afterAll(() => {
    mongoose.disconnect();
});

describe('actors route', () => {
    it('creates an actor', () => {
        return request(app).post('/api/actors')
            .send({
                name: 'Keanu Reeves',
                dob: new Date('September 2, 1964'),
                pob: 'Beirut, Lebanon'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Keanu Reeves',
                    dob: expect.any(String),
                    pob: 'Beirut, Lebanon'          
                });
            });
    });

    it('gets all actors', () => {
        return request(app).get('/api/actors')
            .then(retrievedActors => {
                createdActors.forEach(createdActor => {
                    expect(retrievedActors.body).toContainEqual(createdActor);
                });
            });
    })

    it('gets actor by id', () => {
        return request(app).get(`/api/actors/${createdActors[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdActors[0], __v: expect.any(Number) })
            })
    })

    
});

