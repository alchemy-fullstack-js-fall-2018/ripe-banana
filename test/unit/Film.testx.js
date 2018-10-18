const { getErrors } = require('./helpers');
const Film = require('../../lib/models/Film');
const { Types } = require('mongoose');

describe('Film Model', () => {

    it('returns the Film Schema Model', () => {
        const data = {
            title: 'Bladecrawler',
            studio: Types.ObjectId(),
            released: 1991,
            cast: [{
                role: 'lead',
                actor: Types.ObjectId()
            }]
        };

        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ _id: expect.any(Object), cast: [{ role: 'lead', actor: expect.any(Object), _id: expect.any(Object) }], released: 1991, studio: expect.any(Object), title: expect.any(String) });
    });

    it('validates that a name has been passed', () => {
        const film = new Film({
            released: 1991
        });

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
    });
});
