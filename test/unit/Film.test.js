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

        expect(jsonFilm._id).toBeTruthy();
        expect(jsonFilm.cast[0]._id).toBeTruthy();
        
        data._id = jsonFilm._id;
        data.cast[0]._id = jsonFilm.cast[0]._id;
        
        expect(jsonFilm).toEqual(data);
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
