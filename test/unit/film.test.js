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
});
