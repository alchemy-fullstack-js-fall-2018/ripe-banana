const { getErrors } = require('./helpers');
const Review = require('../../lib/models/Review');
const { Types } = require('mongoose');

describe.skip('review model', () => {
    it('validates a good model', () => {
        const data = {
            rating: 3,
            reviewer: Types.ObjectId(),
            review: 'fair-to-middlin\'',
            film: Types.ObjectId()
        };

        const review = new Review(data);
        const jsonReview = review.toJSON();

        expect(jsonReview._id).toBeDefined();
        expect(jsonReview.createdAt).toBeTruthy();
    });

    it('requires a rating, reviewer, review, and film', () => {
        const data = {};
        const review = new Review(data);

        const errors = getErrors(review.validateSync(), 4);
        expect(errors.rating.kind).toEqual('required'),
        expect(errors.reviewer.kind).toEqual('required'),
        expect(errors.review.kind).toEqual('required'),
        expect(errors.film.kind).toEqual('required')
    });
});
