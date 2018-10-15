const Film = require('../../lib/models/Film');
const { getErrors } = require('../util/helpers');
const Chance = require('chance');
const chance = new Chance();

describe('film model', () => {
    it('validates a good model', () => {
        const data = {
            title: 'Hot Pursuit', 
            studio: chance.guid(),
            released: 2015, 
            cast: [{
                role: 'Cop', 
                actor: chance.guid()
            }]
        };
        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ ...data, _id: expect.any(Object) });
        expect(jsonFilm.cast[0]).toEqual({ ...data.cast[0] });
    });
});
