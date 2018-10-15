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
        expect(jsonFilm).toEqual({ ...data, cast: [{ _id: expect.any(Object), role: 'Benjamin Gates', actor: expect.any(Object) }], _id: expect.any(Object) });
    });

    it('requires a title and release year', () => {
        const film = new Film({
            studio: Types.ObjectId(),
            cast: [{
                role: 'Benjamin Gates',
                actor: Types.ObjectId()
            }]
        });
        const errors = getErrors(film.validateSync(), 2);
        expect(errors.title.kind).toEqual('required');
        expect(errors.released.kind).toEqual('required');
    });
});
