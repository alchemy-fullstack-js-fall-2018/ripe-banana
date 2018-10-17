require('dotenv').config();
require('../../lib/util/connect')();
const request = require('supertest');
const app = require('../../lib/app');

let actors = [
    {
        name: 'Keanu Reeves',
        dob: new Date('September 2, 1964'),
        pob: 'Beirut, Lebanon'
    },
    {
        name: 'Alicia Vikander',
        dob: new Date('October 3, 1988'),
        pob: 'Gothenburg, Sweden'
    }
];

const createActor = actor => {
    return request(app).post('/api/actors')
        .send(actor)
        .then(res => res.body);
};

const createActors = () => {
    return Promise.all(actors.map(createActor));
};

module.exports = {
    createActors
};
