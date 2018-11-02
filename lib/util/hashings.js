const bcrypt = require('bcryptjs');

const generateHash = password => {
    return bcrypt.hashSync(password, 8);
};

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
    generateHash,
    comparePassword
};
