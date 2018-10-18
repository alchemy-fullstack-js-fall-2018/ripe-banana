const { getErrors } = require('./helpers');
const Studio = require('../../lib/models/Studio');

describe('Studio Model', () => {
    it('validates the Studio Schema Model', () => {
        const data = {
            name: 'Compost Cinema',
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'United States'
            }
        };

        const studio = new Studio(data);
        const jsonStudio = studio.toJSON();
        expect(jsonStudio).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('fails when no name is invalid', () => {
        const studio = new Studio ({
            address: {
                city: 'Dumpsville',
                state: 'ZZ',
                country: 'Sarahstan'
            }
        });
        
        const errors = getErrors(studio.validateSync(), 2);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });

});
