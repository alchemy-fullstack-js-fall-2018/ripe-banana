const { getErrors } = require('./helpers');
const Review = require('../../lib/models/Review');
const { Types } = require('mongoose');

describe('Review Model', () => {
    it('creates a new Review when valid data is passed', () => {
        const data = {
            rating: 2,
            reviewer: Types.ObjectId(),
            review: 'This is a review of our movie',
            film: Types.ObjectId()
        };

        const review = new Review(data);
        const jsonReview = review.toJSON();
        expect(jsonReview).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('validates that a properties have been passed', () => {
        const review = new Review({
            createdAt: 1991
        });

        const errors = getErrors(review.validateSync(), 4);
        expect(errors.rating.properties.message).toEqual(
            'Path `rating` is required.'
        );
    });
});
