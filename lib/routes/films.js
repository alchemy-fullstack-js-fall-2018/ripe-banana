// ##### `GET /films`

// ```
// [{ 
//     _id, title, released, 
//     studio: { _id, name } 
// }]
// ```

// ##### `GET /films/:id`

// ```
// {   
//     title, released, 
//     studio: { _id, name }, 
//     cast: [{ 
//         _id, role, 
//         actor: { _id, name }
//     }], 
//     reviews: [{ 
//         id, rating, review, 
//         reviewer: { _id, name }
//     ]
// }
//delete, post, get, post

