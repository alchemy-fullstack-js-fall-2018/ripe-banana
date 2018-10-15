const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/Reviewer');

describe('reviewer model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Bob Miller',
            company: 'YourScriptSucks.com'
        };

        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    
    });
});
