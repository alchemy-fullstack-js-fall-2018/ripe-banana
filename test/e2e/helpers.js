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

let reviewers = [
    {
        name: 'Owen Gleiberman',
        company: 'Entertainment Weekly'
    },
    {
        name: 'Sheila',
        company: 'popqueens.com/thatssosheila'
    },
    {
        name: 'Bobby Jones',
        company: 'welovemovies.net'
    }
];

const createActor = actor => {
    return request(app).post('/api/actors')
        .send(actor)
        .then(res => res.body);
};

const createStudio = studio => {
    return request(app).post('/api/studios')
        .send(studio)
        .then(res => res.body);
};

const createReviewer = reviewer => {
    return request(app).post('/api/reviewers')
        .send(reviewer)
        .then(res => res.body);
};

const createActors = () => {
    return Promise.all(actors.map(createActor));
};

const createStudios = () => {
    return Promise.all(studios.map(createStudio));
};

const createReviewers = () => {
    return Promise.all(reviewers.map(createReviewer));
};

module.exports = {
    createActors,
    createStudios,
    createReviewers
};
