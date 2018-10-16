const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

describe('reviews', () => {
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
        }
    ];

    let studio = {
        name: 'Portland Studios',
        address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
        }
    };

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

    const createFilm = film => {
        return request(app)
            .post('/films')
            .send(film)
            .then(res => res.body);
    };

    let createdActors;
    let createdStudio;
    let createdFilms;

})
