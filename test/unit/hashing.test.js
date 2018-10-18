const { hash } = require('../../lib/util/hashing');

describe('password hasher', () => {
    it('hashes a password', () => {
        const hashedPassword = hash('abcd');
        expect(hashedPassword).not.toEqual('abcd');
    });
});