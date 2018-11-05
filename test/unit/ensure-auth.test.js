const ensureAuth = require('../../lib/util/ensure-auth');
const { tokenize } = require('../../lib/util/tokenizer');

describe('ensure auth middleware', () => {
    it('checks a bearer token', done => {
        const token = tokenize({ name: 'me' });
        const req = {
            token
        };

        const next = () => {
            expect(req.user).toEqual({ name: 'me' });

            done();
        };

        ensureAuth(req, null, next);
    });

    it('checks a bad token and fails when it is bad', done => {
        const req = {
            token: 'fakeyfakerson'
        };

        const next = (err) => {
            expect(err).toBeDefined();
            done();
        };

        ensureAuth(req, null, next);
    });
});
