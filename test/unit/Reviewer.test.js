const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/Reviewer');

describe.skip('Reviewer Model', () => {
    it('returns the Reviewer Schema Model', () => {
        const data = {
            name: 'Roger Ebert',
            company: 'Two Thumbs Up'
        };

        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('validates that a name has been passed', () => {
        const reviewer = new Reviewer({
            company: 'Two Thumbs Up'
        });

        const errors = getErrors(reviewer.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });
});


