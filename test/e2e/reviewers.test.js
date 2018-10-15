require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');

describe('reviewers route', () => {
    it('creates a reviewer', () => {
        return request(app).post('/api/reviewers')
            .send({
                name: 'Tommy Applegate',
                company: 'notlovingit.com'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Tommy Applegate',
                    company: 'notlovingit.com'
                });
            });
    })
});
