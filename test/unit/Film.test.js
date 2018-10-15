const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

describe('Film model', () => {

    it.only('validates a good model', () => {

        const studioData = {
            name: 'Willamette Pictures',
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        };

        const actor1Data = {
            name: 'Wanda Wanderson',
            dob: new Date('1971-01-01T08:00:00.000Z'),
            pob: 'Peoria'
        };

        const actor2Data = {
            name: 'Peter Peterson',
            dob: new Date('1972-01-01T08:00:00.000Z'),
            pob: 'Detroit'
        };

        const studio = new Studio(studioData);
        const actor1 = new Actor(actor1Data);
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
        const jsonFilm = film.toJSON();
        console.log(jsonFilm);
        expect(jsonFilm).toEqual({ ...filmData, _id: expect.any(Object) });
        


    });
    
});
