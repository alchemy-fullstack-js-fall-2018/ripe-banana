require('dotenv').config();
const { dropCollection } = require('../util/db');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const request = require('supertest');

describe('studios pub/sub API', () => {

    let studios = [
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        },
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        },
        {
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        }
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
        return Promise.all(studios.map(createStudio))
            .then(studioRes => createdStudios = studioRes);
    });

    it('creates a studio on post', () => {
        return request(app)
            .post('/api/studios')
            .send({
                name: 'Marvel Studios',
                address: {
                    city: 'Burbank',
                    state: 'California',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Marvel Studios',
                    address: {
                        city: 'Burbank',
                        state: 'California',
                        country: 'United States'
                    }
                });
            });
    });

});
