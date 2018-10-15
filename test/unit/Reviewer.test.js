const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');

xdescribe ('Reviewer model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Gene Ebert',
            company: 'At the Movies'
        };
        
        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const reviewer = new Reviewer({
            name: '',
            company: ''
        });

        const errors = getErrors(reviewer.validateSync(), 2);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });   
    

});
