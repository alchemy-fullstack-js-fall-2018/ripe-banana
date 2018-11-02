const { getErrors } = require('../util/helpers');
const User = require('../../lib/models/User');

xdescribe('user model', () => {
    it('return a valid user model', () => {
        const data = {
            name: 'Dr. Ham',
            email: 'ham@drham.com',
        };
        const user = new User(data);
        const jsonUser = user.toJSON();
        expect(jsonUser).toEqual({ ...data, _id: expect.any(Object) });
    })
})