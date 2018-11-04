const mongoose = require('mongoose');
const { Schema } = mongoose;
const { hash, compare } = require('../util/hashing');
const { tokenize, untokenize } = require('../util/tokenizer');

const reviewerSchema = new Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { 
        type: String, 
        required: [true, 'Email is required.'],
        unique: true 
    },
    passwordHash: String,
    role: {
        type: String, 
        enum: ['Admin', 'User'],
        required: true
    }
}, {    
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret.passwordHash;
        }
    }
});

reviewerSchema.virtual('clearPassword').set(function(password) {
    this._tempPassword = password;
});

reviewerSchema.pre('save', function(next) {
    this.passwordHash = hash(this._tempPassword);
    next();
});

reviewerSchema.methods.compare = function(clearPassword) {
    return compare(clearPassword, this.passwordHash);
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

module.exports = mongoose.model('Reviewer', reviewerSchema);
