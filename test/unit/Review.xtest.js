const Reviewer = require('../../lib/models/Reviewer');
const Studio = require('../../lib/models/Studio');
const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');
const Review = require('../../lib/models/Review');

const { getErrors } = require('./helpers');

describe('Review model', () => {
    
    it('validates a good Review', () => {
        const studioData = {
            name: 'Willamette Pictures',
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        };
        const studio = new Studio(studioData);
    
        const actor1Data = {
            name: 'Wanda Wanderson',
            dob: new Date('1971-01-01T08:00:00.000Z'),
            pob: 'Peoria'
        };
        const actor1 = new Actor(actor1Data);
    
        const actor2Data = {
            name: 'Peter Peterson',
            dob: new Date('1972-01-01T08:00:00.000Z'),
            pob: 'Detroit'
        };
        const actor2 = new Actor(actor2Data);
    
    
        const filmData = {
            title: 'Code Storm',
            studio: studio._id,
            released: 1945,
            cast: [ 
                { role: 'Lead Programmer', actor: actor1._id }, 
                { role: 'Product Manager', actor: actor2._id }
            ]
        };
        const film = new Film(filmData);
    
        const reviewerData = {
            name: 'Gene Ebert',
            company: 'At the Movies'
        };
        const reviewer = new Reviewer(reviewerData);
    
        const reviewData = {
            rating: 5,
            reviewer: reviewer._id,
            text: 'Wow!  You should totally see this movie!!',
            film: film._id
        };
        const review = new Review(reviewData);
        const jsonReview = review.toJSON();
        expect(jsonReview).toEqual({
            _id: expect.any(Object),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            ...reviewData
        });       
    });
    
    it('requires a review text, rating, reviewer, and film', () => {
        const review = new Review({
            text: '',
            rating: null,
            reviewer: null,
            film: null
        });

        const errors = getErrors(review.validateSync(), 4);
        expect(errors.text.properties.message).toEqual('Path `text` is required.');
        expect(errors.rating.properties.message).toEqual('Path `rating` is required.');
        expect(errors.reviewer.properties.message).toEqual('Path `reviewer` is required.');
        expect(errors.film.properties.message).toEqual('Path `film` is required.');
    }); 
});
