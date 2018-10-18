const mongoose = require('mongoose');
const { hash, compare } = require('../util/hashing');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: String,
    roles: [{
        type: [String],
        enum: ['admin', 'editor']
    }]
});

reviewerSchema.virtual('clearPassword').set(function(password) {
    this._tempPassword = password;
});

reviewerSchema.pre('save', function(next) {
    this.hash = hash(this._tempPassword);
    next();
});

reviewerSchema.methods.compare = function(clearPassword) {
    return compare(clearPassword, this.hash);
};

const Reviewer = mongoose.model('Reviewer', reviewerSchema);
module.exports = Reviewer;
