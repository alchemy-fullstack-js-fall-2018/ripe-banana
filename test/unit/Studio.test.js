const { getErrors } = require('./helpers');
const Studio = require('../../lib/models/Studio');

describe('Studio model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'A24',
            address: {
                city: 'New York',
                state: 'NY',
                country: 'USA'
            }            
        };

        const studio = new Studio(data);
        const jsonStudio = studio.toJSON();
        expect(jsonStudio).toEqual({ ...data, _id: expect.any(Object)})
    });

    it('requires a name', () => {
        const studio = new Studio({
            address: {
                city: 'New York',
                state: 'NY',
                country: 'USA'
            }
        });

        const errors = getErrors(studio.validateSync(), 1);
        expect(errors.name.kind).toEqual('required');
    });
});
