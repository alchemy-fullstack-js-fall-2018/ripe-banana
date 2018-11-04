const app = require('../../lib/app');
const request = require('supertest');
require('./db');
const { actors, studios, reviewers } = require('./data');


const createActor = actor => {
    return request(app)
        .post('/actors')
        .send(actor)
        .then(res => res.body);
};

const createStudio = studio => {
    return request(app)
        .post('/studios')
        .send(studio)
        .then(res => res.body);
};

const createReviewer = reviewer => {
    return request(app)
        .post('/reviewers/signup')
        .send(reviewer)
        .then(res => res.body);
};

const createReviewerToken = reviewer => {
    return request(app)
        .post('/reviewers/signin')
        .send(reviewer)
        .then(res => res.body.token);
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

const createReviewerTokens = () => {
    return Promise.all(reviewers.map(createReviewerToken));
};


module.exports = {
    createStudios, 
    createActors,
    createReviewers,
    createReviewerTokens
};
