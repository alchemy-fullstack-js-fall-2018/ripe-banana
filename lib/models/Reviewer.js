const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `name` is required.']
    },
    company: String
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
