const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./getErrors');

describe('Film model', () => {

    it('validates a good model', () => {

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
        expect(jsonFilm).toEqual({
            _id: expect.any(Object),
            title: 'Code Storm',
            studio: studio._id,
            released: 1945,
            cast: [ 
                { _id: expect.any(Object), role: 'Lead Programmer', actor: actor1._id }, 
                { _id: expect.any(Object), role: 'Product Manager', actor: actor2._id }
            ]
        });
    });

    it('requires a title', () => {
        const film = new Film({
            title: '',
            studio: null,
            released: null,
            cast: [{ role: 'Dog Catcher', actor: null }]
        });

        const errors = getErrors(film.validateSync(), 4);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
        expect(errors.studio.properties.message).toEqual('Path `studio` is required.');
        expect(errors.released.properties.message).toEqual('Path `released` is required.');
        expect(errors['cast.0.actor'].properties.message).toEqual('Path `actor` is required.');
    }); 
});
