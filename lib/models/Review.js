const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Path `rating` is required.'],
        min: 1,
        max: 5
    },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer', required: [true, 'Path `reviewer` not found'] },
    review: {
        type: String,
        maxlength: 140,
        required: [true, 'Path `review` is required.']
    },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: [true, 'Path `film` is required'] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
