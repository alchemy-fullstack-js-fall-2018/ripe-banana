const { tokenize, untokenize } = require('../../lib/util/tokenizer');

describe('tokenizer', () => {
    it('creates a token for a payload', () => {
        const token = tokenize({ name: 'karen' });
        expect(token).toEqual(expect.any(String));
    });

    it('decodes a token with payload', () => {
        const token = tokenize({ name: 'mike' });
        const decodedToken = untokenize(token);

        expect(decodedToken).toEqual({ name: 'mike' });
    });
});