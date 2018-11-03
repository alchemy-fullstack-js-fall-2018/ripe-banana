const ensureAuth = require('../../lib/util/ensure-auth');
const { tokenize } = require('../../lib/util/tokenizer');

describe('ensure auth middleware', () => {
    it('checks a bearer token', done => {
        const token = tokenize({ name: 'me' });
        
        const req = {
            token
        };

        const next = () => {
            expect(req.reviewer).toEqual({ name: 'me' });
            done();
        };

        ensureAuth(req, null, next);
    });

    it('checks a bearer token and fails when its bad', done => {
        const req = {
            token: 'aidfajoaij'
        };

        const next = (err) => {
            expect(err).toBeDefined();
            done();
        };

        ensureAuth(req, null, next);
    });
});
