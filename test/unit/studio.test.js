// const { getErrors } = require('./helpers');
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

});
