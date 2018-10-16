const { getErrors } = require('./helpers');
const Actor = require('../../lib/models/Actor');

describe('Actor Model', () => {
    it('returns the Actor Schema Model', () => {
        const data = {
            name: 'Anthony Hopkins',
            dob: new Date(),
            pob: 'Cambridge'
        };
        
        const actor = new Actor(data);
        const jsonActor = actor.toJSON();
        expect(jsonActor).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('validates that a name has been passed', () => {
        const actor = new Actor({
            dob: new Date(),
            pob: 'Cambridge'
        });

        const errors = getErrors(actor.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });
});
