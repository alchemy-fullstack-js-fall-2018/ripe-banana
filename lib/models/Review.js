const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewer: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer',
        required: true
    },
    review: {
        type: String,
        maxlength: 140,
        required: true
    },
    film: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Film',
        required: true
    },
    timestamps: {
        createdAt: Date,
        updatedAt: Date
    }
});

module.exports = mongoose.model('Review', reviewSchema);
