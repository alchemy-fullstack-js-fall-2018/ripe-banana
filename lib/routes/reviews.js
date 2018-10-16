const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res) => {
        const { rating, reviewer, review } = req.body;
        Review.create({ rating, reviewer, review })
            .then(review => res.json(review));
    })
    
    .get('/', (req, res) => {
        Review.find()
            .populate({ path: 'review.film', select: 'title' })
            .select({ rating: true, review: true })
            .then(reviews => res.json(reviews));
    });
    


// ##### `GET /reviews`

// **limit to 100 most recent**

// ```
// [{ 
//     _id, rating, review, 
//     film: { _id, title }
// }] 
// ```

//*last - put, post, get
