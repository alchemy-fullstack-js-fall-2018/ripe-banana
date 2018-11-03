const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const ensureAuth = require('../util/ensure-auth');
const { HttpError } = require('../util/errors');

module.exports = router 

    .post('/signup', (req, res, next) => {
        const { name, company, email, clearPassword, roles } = req.body;
        Reviewer.create({ name, company, email, clearPassword, roles })
            .then(result => res.json(result))
            // .then(result => {
            //     console.log('signed up reviewer', result);
            //     res.json(result);
            // })
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, clearPassword } = req.body;
        Reviewer.findOne({ email }).then(user => {
            const isValid = user && user.compare(clearPassword);
            if(isValid) {
                const token = user.authToken();
                res.json({ token });
            } else {
                next(new HttpError({
                    code: 401,
                    message: 'Invalid email or password'
                }));
            }
        });
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/verify', ensureAuth, (req, res) => {
        res.json({ success: !!req.user });
    })

    .get('/:id', (req, res, next) => {
        const reviewerId = req.params.id;
        Promise.all([
            Reviewer.findById(reviewerId).select({ __v: false, roles: false, email: false, hash: false }).lean(),                
            Review.find({ reviewer: reviewerId })
                .select({ __v: false, updatedAt: false, createdAt: false, reviewer: false })
                .populate({
                    path: 'film', select: 'title'
                })
                .lean()
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.findByIdAndUpdate(id, { name, company }, { new: true })
            .then(result => res.json(result))
            .catch(next);
    });


