const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    text: {
        type: String,
        maxlength: 140,
        required: true
    },
    film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
