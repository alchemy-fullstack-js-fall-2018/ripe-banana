const Review = require('../../lib/models/Review');
const { getErrors } = require('../util/helpers');
const { Types } = require('mongoose');

describe('review model', () => {
    it('validates a good model', () => {
        const data = {
            rating: 1,
            reviewer: Types.ObjectId(),
            review: 'Horrible movie, why not',
            film: Types.ObjectId(),
            timestamps: {
                createdAt: new Date(2014, 4, 15),
                updatedAt: new Date(2015, 3, 12)
            }
        };
        const review = new Review(data);
        const jsonReview = review.toJSON();
        expect(jsonReview).toEqual({ ...data, _id: expect.any(Object) });
    });
});
