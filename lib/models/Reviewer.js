const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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

reviewerSchema.virtual('clearPassword').set(function(password) {
    this._tempPassword = password;
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);
module.exports = Reviewer;
