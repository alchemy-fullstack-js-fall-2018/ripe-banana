require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const Film  = require('../../lib/models/Film');

describe('film routes', () => {
    it('creates a film on POST', () => {
        return request(app).post('/api/films')
            .send({
                title: 'Austin Powers: International Man of Mystery',
                studio: 'New Line Cinema',
                released: 1999,
                cast: [
                    {
                        role: 'Austin Powers',
                        actor: Types.ObjectId()
                    },
                    {
                        role: 'Scott Evil',
                        actor: Types.ObjectId()
                    }
                ]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    title: 'Austin Powers: International Man of Mystery',
                    studio: 'New Line Cinema',
                    released: 1999,
                    cast: [
                        {
                            role: 'Austin Powers',
                            actor: expect.any(Object)
                        },
                        {
                            role: 'Scott Evil',
                            actor: expect.any(Object)
                        }
                    ]
                });
            });
    });
});
