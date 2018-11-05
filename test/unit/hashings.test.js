const { generateHash, comparePassword } = require('../../lib/util/hashings');

describe('password hashing', () => {

    const hashedPassword = generateHash('zyxw');

    it('hashes a password', () => {
        expect(hashedPassword).not.toEqual('zyxw');
    });

    it('compares a hashed password', () => {
        const compared = comparePassword('zyxw', hashedPassword);
        expect(compared).toBeTruthy();
    });
});

