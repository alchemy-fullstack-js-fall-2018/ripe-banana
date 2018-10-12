const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Studio = require('../../lib/models/Studio');

describe('studio route', () => {

    let studios = [
        {
            name: 'A24',
            address: {
                city: 'New York',
                state: 'NY',
                country: 'USA'
            }            
        },
        {
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }            
        },
        {
            name: 'Pixar',
            address: {
                city: 'Emeryville',
                state: 'CA',
                country: 'USA'
            }            
        }
    ];

    // const createStudio = studio => {
    //     return request(app)
    //         .post
    // }
    it('creates a studio on POST', () => {
        return request(app).post('/api/studios')
            .send({
                name: 'A24',
                address: {
                    city: 'New York',
                    state: 'NY',
                    country: 'USA'
                }           
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'A24',
                    address: {
                        city: 'New York',
                        state: 'NY',
                        country: 'USA'
                    }           
                });
            });
    });
});
