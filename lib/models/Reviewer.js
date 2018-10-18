const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = mongoose.model('Reviewer', reviewerSchema);
