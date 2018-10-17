const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('../util/helpers');

describe('reviewer model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Caillou Pettis',
            company: 'Pettis Inc'
        };

        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name and a company', () => {
        const reviewer = new Reviewer({});

        const errors = getErrors(reviewer.validateSync(), 2);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
        expect(errors.company.properties.message).toEqual('Path `company` is required.');
    });

});
