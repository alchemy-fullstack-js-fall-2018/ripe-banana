const Film = require('../../lib/models/Film');
const { getErrors } = require('../util/helpers');
const { Types } = require('mongoose');

describe('film model', () => {
    it('validates a good model', () => {
        const data = {
            title: 'Hot Pursuit', 
            studio: Types.ObjectId(),
            released: 2015, 
            cast: [{
                role: 'Cop', 
                actor: Types.ObjectId()
            }]
        };
        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires title, studio and released fields', () => {
        const film = new Film({});

        const errors = getErrors(film.validateSync(), 3);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
        expect(errors.studio.properties.message).toEqual('Path `studio` is required.');
        expect(errors.released.properties.message).toEqual('Path `released` is required.');
    });

    it('requires actor', () => {
        const film = new Film({
            title: 'Hot Pursuit', 
            studio: Types.ObjectId(),
            released: 2015, 
            cast: [{
                role: 'Cop', 
            }]
        });

        const errors = getErrors(film.validateSync(), 1);
        expect(errors['cast.0.actor'].properties.message).toEqual('Path `actor` is required.');
    });
});
