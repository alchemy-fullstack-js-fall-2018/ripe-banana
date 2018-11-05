const { getErrors } = require('../util/helpers');
const Reviewer = require('../../lib/models/Reviewer');
const bcrypt = require('bcryptjs');
const Chance = require('chance');
const chance = new Chance();

describe('Reviewer model', () => {

    it('validates a good model', () => {

        const data = {
            name: chance.name(),
            company: chance.company(),
            email: chance.email(),
            roles: ['admin']
        };

        const reviewer = new Reviewer(data);
        const jsonReviewer = reviewer.toJSON();
        expect(jsonReviewer).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {

        const reviewer = new Reviewer({
            company: chance.company(),
            email: chance.email(),
        });

        const errors = getErrors(reviewer.validateSync(), 3);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });

});
