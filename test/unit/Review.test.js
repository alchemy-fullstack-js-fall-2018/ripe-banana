const { getErrors } = require('./helpers');
const { dropCollection } = require('../e2e/db');
const Review = require('../../lib/models/Review');
const request = require('supertest');
const app = require('../../lib/app');
const { Types } = require('mongoose');

describe('Review Model', () => {

    it('creates a new Review when valid data is passed', () => {
        const data = {
            rating: 2,
            reviewer: Types.ObjectId(),
            review: {
                text: 'This is a review of our movie',
                film: Types.ObjectId()
            }
        };

        const review = new Review(data);
        const jsonReview = review.toJSON();
        // getErrors(review.validateSync(), 0);
            
        expect(jsonReview).toEqual({ ...data, _id: expect.any(Object) });
    });

    // it('validates that a name has been passed', () => {
    //     const film = new Film({
    //         released: 1991
    //     });

        // const errors = getErrors(film.validateSync(), 1);
        // expect(errors.title.properties.message).toEqual('Path `title` is required.');
    // });
});