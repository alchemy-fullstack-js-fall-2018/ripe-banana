const mongoose = require('mongoose');
const { hash, compare } = require('../util/hashing');
const { tokenize, untokenize } = require('../util/tokenizer');

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
    }],
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret.hash;
        }
    }

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

reviewerSchema.methods.authToken = function() {
    const jsonUser = this.toJSON();
    return tokenize(jsonUser);
};

reviewerSchema.statics.findByToken = function(token) {
    try {
        const user = untokenize(token);
        console.log ('untokenized user', user);
        return Promise.resolve(user);
    } catch(e) {
        return Promise.resolve(null);
    }
};

const Reviewer = mongoose.model('Reviewer', reviewerSchema);
module.exports = Reviewer;
