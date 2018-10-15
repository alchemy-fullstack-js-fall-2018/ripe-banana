const Review = require('../../lib/models/Review');
const { getErrors } = require('./helpers');

describe('Review model', () => {

    const filmData = {
        title: 'Code Storm',
        studio: studio._id,
        released: 1945,
        cast: [ 
            { role: 'Lead Programmer', actor: actor1._id }, 
            { role: 'Product Manager', actor: actor2._id }
        ]
    };

    const reviewerData = {
        name: 'Gene Ebert',
        company: 'At the Movies'
    };

    const film = new Film(filmData);
    const reviewer = new reviewer(reviewerData);

    const reviewData = {
        rating: 5,
        reviewer: reviewer._id,
        review: 'Wow!  You should totally see this movie!!',
        film: film._id
    };

    it('validates a good Review', () => {
        const data = {

        };
    });

});