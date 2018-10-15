const { getErrors } = require('./helpers');
const Film = require('../../lib/models/Film');
const { Types } = require('mongoose');

describe('film model', () => {
    it('validates a good model', () => {
        const data = {
            title: 'National Treasure',
            studio: Types.ObjectId(),
            released: 2004,
            cast: [{
                role: 'Benjamin Gates',
                actor: Types.ObjectId()
            }]
        };
        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ ...data, _id: expect.any(Object) });
    });
});
