const Actor = require('../../lib/model/Actor');
const { getErrors } = require('../util/helpers');

describe('actor model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Shia Labeouf',
            dob: new Date(1986, 6, 11),
            pob: 'Los Angeles, CA'
        };

        const actor = new Actor(data);
        const jsonActor = actor.toJSON();
        expect(jsonActor).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const actor = new Actor({
            dob: new Date(1986, 6, 11),
            pob: 'Los Angeles, CA'
        });

        const errors = getErrors(actor.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });
});
