const { getErrors } = require('./helpers');
const Actor = require('../../lib/models/Actor');

describe('actor model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Steve Buscemi',
            dob: new Date('December 13, 1957'),
            pob: 'New York, NY'
        };

        const actor = new Actor(data);
        const jsonActor = actor.toJSON();
        expect(jsonActor).toEqual({ ...data, _id: expect.any(Object) });
    });

    
    it('requires a name', () => {
        const actor = new Actor({});

        const errors = getErrors(actor.validateSync(), 1);
        expect(errors.name.kind).toEqual('required');
    });
});
