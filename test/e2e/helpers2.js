const app = require('../../lib/app');
const request = require('supertest');
const { dropCollection } = require('./db');

let createdFilms;
let createdStudios;
let createdActors;
let createdReviewers;
let createdReviews;

let actors = [
    {
        name: 'Matt Diamond',
        dob: new Date('11-11-1911'),
        pob: 'Sweden'
    },
    {
        name: 'Susan Surandin',
        dob: new Date('04-14-1985'),
        pob: 'Miami'
    },
    {
        name: 'Perpetually Unemployed',
        dob: new Date('12-12-1912'),
        pob: 'Canada'
    }
];

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
    },
    {
        name: 'Defunct Studio',
        address: {
            city: 'Pasadena',
            state: 'CA',
            country: 'USA'
        }
    }
];

let reviewers = [
    { name: 'George Watchington', company: 'Patriot Films' },
    { name: 'Abraham Linkoln', company: 'Great Confilict Productions' }
];

let films = [
    {
        title: 'The Programinator',
        studio: createdStudios[0]._id,
        released: 1984,
        cast: [
            { role: 'Chief Troublemaker', actor: createdActors[0]._id }, 
            { role: 'Sidekick', actor: createdActors[1]._id }
        ]
    },
    {
        title: 'Thelma and Luigi',
        studio: createdStudios[0]._id,
        released: 1972,
        cast: [
            { role: 'Thelma', actor: createdActors[1]._id }, 
            { role: 'Luigi', actor: createdActors[0]._id }
        ]
    }
];

let reviews = [
    {
        rating: 5,
        reviewer: createdReviewers[0]._id,
        text: 'Amazeballs!',
        film: createdFilms[0]._id 
    },
    {
        rating: 1,
        reviewer: createdReviewers[1]._id,
        text: 'I want the last 1.5 hours of my life back.',
        film: createdFilms[1]._id 
    }
];


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
        .post('/reviewers')
        .send(reviewer)
        .then(res => res.body);
};

const createFilm = film => {
    return request(app)
        .post('/films')
        .send(film)
        .then(res => res.body);
};

const createReview = review => {
    return request(app)
        .post('/reviews')
        .send(review)
        .then(res => res.body);
};

const createActors = () => {
    return Promise.all(actors.map(createActor))
        .then(actorsRes => { createdActors = actorsRes;});
};

const createStudios = () => {
    return Promise.all(studios.map(createStudio))
        .then(studiosRes => { createdStudios = studiosRes;});
};

const createReviewers = () => {
    return Promise.all(reviewers.map(createReviewer))
        .then(reviewersRes => { createdReviewers = reviewersRes;});
};

const createReviews = () => {
    return Promise.all(reviews.map(createReview))
        .then(reviewsRes => { createdReviews = reviewsRes;});
};

const createFilms = () => {
    return Promise.all(films.map(createFilm))
        .then(filmsRes => { createdFilms = filmsRes;});
};

//createActors();
    // .then(createReviewers())
    // .then(createStudios())
    // .then(createFilms())
    // .then(createReviews());

let createdData = {
    // createdFilms,
    // createdStudios,
    createdActors
    // createdReviewers,
    // createdReviews
};

module.exports = {
    createdData
};