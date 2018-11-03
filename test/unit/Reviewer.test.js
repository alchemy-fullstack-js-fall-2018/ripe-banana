const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');
const bcrypt = require('bcryptjs');


describe ('Reviewer model', () => {
    
    it('validates a good model', () => {
        const data = {
            name: 'Gene Ebert',
            company: 'At the Movies',
            email: 'genieinabottle@yahoo.com',
            roles: ['admin']
        };
        
        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {
        const reviewer = new Reviewer({
            name: '',
            company: '',
            email: ''
        });

        const errors = getErrors(reviewer.validateSync(), 3);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
        expect(errors.company.properties.message).toEqual('Path `company` is required.');
        expect(errors.email.properties.message).toEqual('Path `email` is required.');

    });   

});
