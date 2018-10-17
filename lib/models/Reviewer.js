const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    company: {
        type: String,
        required: true
    },
    email: String,
    hash: String,
    roles: [{
        type: [String],
        enum: ['admin', 'editor']
    }]
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);
module.exports = Reviewer;
