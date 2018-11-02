const { tokenize, untokenize } = require('../../lib/util/tokenizer');

describe('tokenizer', () => {
    it('creates a token for payload', () => {
        const token = tokenize({ name: 'sophie' });
        expect(token).toEqual(expect.any(String));
    });
});
