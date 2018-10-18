require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');
const { createActors, createReviewers, createStudios } = require('./helpers');

describe('reviews routes', () => {

    let createdActors;
    let createdReviewers;
    let createdStudios;
    let createdFilms;
    let createdReviews;

    const createFilm = film => {
        return request(app).post('/api/films')
            .send(film)
            .then(res => {
                return res.body;
            });
    };
    
    it('creates a review on POST', () => {
        const data = {
            
        };
        return request(app).post('/api/reviews')
            .send()
    });


});
