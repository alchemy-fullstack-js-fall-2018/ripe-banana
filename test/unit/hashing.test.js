const { hash, compare } = require('../../lib/util/hashing');

describe('password hasher', () => {
    it('hashes a password', () => {
        const hashedPassword = hash('banana');
        expect(hashedPassword).not.toEqual('banana');
    });

    it('compare password', () => {
        const hashedPassword = hash('papaya');
        const comparePassword = compare('papaya', hashedPassword);
        expect(comparePassword).toBeTruthy();
    });

    it('compares a bad password', () => {
        const hashedPassword = hash('pumpkin');
        const comparePassword = compare('pumpkins', hashedPassword);
        expect(comparePassword).toBeFalsy();
    });
});
