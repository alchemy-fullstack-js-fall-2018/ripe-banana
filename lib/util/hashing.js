const bcrypt = require('bcryptjs');

const hash = password => {
    return bcrypt.hashSync(password, 8);
};

module.exports = {
    hash
};