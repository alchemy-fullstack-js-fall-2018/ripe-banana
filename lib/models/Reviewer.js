const mongoose = require('mongoose');
const { hash, compare } = require('../util/hashing');
const { tokenize, untokenize } = require('../util/tokenizer');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `name` is required.']
    },
    company: { 
        type: String,
        required: [true, 'Path `company` is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    role: {
        type: String,
        required: [true, 'User role: admin or user required'],
        enum: ['admin', 'user']
    },
    passwordHash: String
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret.passwordHash;
        }
    }
});

reviewerSchema.virtual('password').set(function(password) {
    this._tempPassword = password;
});

reviewerSchema.pre('save', function(next) {
    this.passwordHash = hash(this._tempPassword);
    next();
});

reviewerSchema.methods.compare = function(password) {
    return compare(password, this.passwordHash);
};

reviewerSchema.methods.authToken = function() {
    const jsonReviewer = this.toJSON();
    return tokenize(jsonReviewer);
};

reviewerSchema.statics.findByToken = function(token) {
    try {
        const reviewer = untokenize(token);
        return Promise.resolve(reviewer);
    } catch(e) {
        return Promise.resolve(null);
    }
};

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
