const mongoose = require('mongoose');
const { generateHash, comparePassword } = require('../util/hashings');
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
    passwordHash: String
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
    this.passwordHash = generateHash(this._tempPassword);
    next();
});

reviewerSchema.methods.compare = function(clearPassword) {
    return comparePassword(clearPassword, this.passwordHash);
};

reviewerSchema.methods.authToken = function() {
    const jsonUser = this.toJSON();
    return tokenize(jsonUser);
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
