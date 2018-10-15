const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

xdescribe ('Studio model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Willamette Pictures',
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        };
        
        const studio = new Studio(data);
        const jsonStudio = studio.toJSON();
        expect(jsonStudio).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const studio = new Studio({
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        });

        const errors = getErrors(studio.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');


    });


    
});
