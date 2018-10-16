const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res) => {
        const { rating, reviewer, review } = req.body;
        Review.create({ rating, reviewer, review })
            .then(review => res.json(review));
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
