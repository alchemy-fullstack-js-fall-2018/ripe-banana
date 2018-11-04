const { hash, compare } = require('../../lib/util/hashing');

describe('password hasher', () => {

    it('hashes a password', () => {
        const hashedPassword = hash('abcd');
        expect(hashedPassword).not.toEqual('abcd');
    });

    it('compares a password', () => {
        const hashedPassword = hash('tacocat');
        const comparePassword = compare('tacocat', hashedPassword);
        expect(comparePassword).toBeTruthy();
    });

    it('compares a bad password', () => {
        const hashedPassword = hash('tacocat');
        const comparePassword = compare('tacocats', hashedPassword);
        expect(comparePassword).toBeFalsy();
    });
});