const app = require('../../lib/app');
const request = require('supertest');

describe('film routes', () => {

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

    let createdActors;

    let studio = {
        name: 'Portland Studios',
        address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
        }
    };

    let createdStudio;

    const createStudio = studio => {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    };
    
    beforeEach(() => {
        return createStudio(studio)
            .then(result => {
                createdStudio = result;
            });
    });
    
    it('creates a film', () => {
        // const newFilm = {
        //     title: '',
        //     studio: '',
        //     released: '',
        //     cast: ''
        // };
        // expect(createdStudio).toEqual(studio)
        expect(true)
    });

});
