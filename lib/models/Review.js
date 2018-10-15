// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//     rating: {
//         type: Number,
//         required: [true, 'Path `rating` is required.'],
//         min: 1,
//         max: 5
//     },
//     reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer' },
//     review: {
//         text: {
//             type: String,
//             required: [true, 'Path `review` is required.'],
//             maxlength: 140
//         },
//         film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: [true, 'Path `film` is required'] },
//         createdAt: Date,
//         updatedAt: Date
//     }
// });

// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;




// { 
//     rating: <rating number 1-5 RN>,
//     reviewer: <review _id RI>
//     review: <review-text, max-length 140 chars RS>,
//     film: <film-id RI>,
//     createdAt: <created timestamp D>,*
//     updatedAt: <updated timestamp D>*
//   }
