const { tokenize, untokenize } = require('../../lib/util/tokenizer');

describe('tokenizer', () => {
    const token = tokenize({ name: 'Mike' });

    it('creates a token for a payload', () => {
        expect(token).toEqual(expect.any(String));
    });

    it('decodes a token with payload', () => {
        const decodedToken = untokenize(token);

        expect(decodedToken).toEqual({ name: 'Mike' });
    });
});
