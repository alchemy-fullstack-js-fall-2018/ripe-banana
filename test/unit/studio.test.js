const Studio = require('../../lib/models/Studio');
const { getErrors } = require('../util/helpers');

describe('studio model', () => {
    it('validates a model', () => {
        const data = {
            name: 'Marvel Studios',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'United States'
            }
        };

        const studio = new Studio(data);
        const jsonStudio = studio.toJSON();
        expect(jsonStudio).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const studio = new Studio({
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'United States'
            }
        });

        const errors = getErrors(studio.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });
});
