// ##### `GET /reviewer`

// ```
// [{ _id, name, company }]
// ```

// ##### `GET /reviewer/:id`

// ```
// { 
//     _id, name, company, 
//     reviews: [{ 
//         _id, rating, review, 
//         film: { _id, title }
//     }] 
// }