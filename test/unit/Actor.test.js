const Actor = require('../../lib/models/Actor');
const { getErrors } = require('./helpers');

describe ('Actor model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Wanda Wanderson',
            dob: new Date('1971-01-01T08:00:00.000Z'),
            pob: 'Peoria'
        };
        
        const actor = new Actor(data);
        const jsonActor = actor.toJSON();
        expect(jsonActor).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const actor = new Actor({
            dob: '01-01-1971',
            pob: 'Peoria'
        });

        const errors = getErrors(actor.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });   
    
});
