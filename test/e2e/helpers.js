const app = require('../../lib/app');
const request = require('supertest');
require('./db');
const { actorsData, studiosData, reviewersData } = require('./data');


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
    return Promise.all(actorsData.map(createActor));
};

const createStudios = () => {
    return Promise.all(studiosData.map(createStudio));
};

const createReviewers = () => {
    return Promise.all(reviewersData.map(createReviewer));
};

const createReviewerTokens = () => {
    return Promise.all(reviewersData.map(createReviewerToken));
};


module.exports = {
    createStudios, 
    createActors,
    createReviewers,
    createReviewerTokens
};
