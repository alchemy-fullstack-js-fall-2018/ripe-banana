require('dotenv').config();
const connect = require('../../lib/util/connect');
connect(`${process.env.MONGODB_URI}_test`);
const mongoose = require('mongoose');

afterAll(() => {
    return mongoose.disconnect();
});

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                    if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};