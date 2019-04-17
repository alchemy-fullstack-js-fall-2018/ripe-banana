const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `name` is required.']
    },
    dob: Date,
    pob: String
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
