const Chance = require('chance');
const chance = new Chance();

const Actor = require('../../lib/models/Actor');
const Studio = require('../../lib/models/Studio');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');
const Review = require('../../lib/models/Review');

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

const jsonify = data => JSON.parse(JSON.stringify(data));

const createActors = (count, arr) => {
    const actorPromises = Array.apply(null, { length: count }).map(() => {
        return Actor.create({
            name: chance.name({ suffix: true }),
            dob: chance.date(),
            pob: chance.city()
        });
    });
    return Promise.all(actorPromises).then(actors => {
        arr.push.apply(arr, jsonify(actors));
        return actors;
    });
};
const createStudios = (count, arr) => {
    const studioPromises = Array.apply(null, { length: count }).map(() => {
        return Studio.create({
            name: chance.animal(),
            address:{
                city: chance.string(),
                state: chance.string(),
                country: chance.string()
            }
        });
    });
    return Promise.all(studioPromises).then(studios => {
        arr.push.apply(arr, jsonify(studios));
        return studios;
    });
};

const createReviewers = (count, arr) => {
    const reviewerPromise = Array.apply(null, { length: count }).map(() => {
        return Reviewer.create({
            name: 'Steve',
            company: 'A Company',
            email: chance.email(),
            clearPassword: chance.word(),
            role: 'Admin'
        });
    });
    return Promise.all(reviewerPromise).then(reviewers => {
        arr.push.apply(arr, jsonify(reviewers));
        return reviewers;
    });
};

const createFilms = (count, arr) => {
    return Promise.all([createActors(count, []), createStudios(count, [])])
        .then(([actors, studios]) => {
            const filmPromise = Array.apply(null, { length: count }).map((item, index) => {
                return Film.create({
                    title: 'Hot Pursuit', 
                    studio: studios[index]._id,
                    released: 2015, 
                    cast: [{
                        role: 'Cop', 
                        actor: actors[index]._id
                    }]
                });
            });
            return Promise.all(filmPromise).then(films => {
                arr.push.apply(arr, jsonify(films));
                return films;
            });
        });
};

const createReviews = (count, arr) => {
    return Promise.all([createFilms(count, []), createReviewers(count, [])])
        .then(([films, reviewers]) => {
            const filmPromise = Array.apply(null, { length: count }).map((item, index) => {
                return Review.create({
                    rating: 1,
                    reviewer: reviewers[index]._id,
                    review: 'Horrible movie, why not',
                    film: films[index]._id
                });
            });
            return Promise.all(filmPromise).then(reviews => {
                arr.push.apply(arr, jsonify(reviews));
                return reviews;
            });
        });
};




module.exports = {
    getErrors,
    createActors,
    createStudios,
    createReviewers,
    createFilms, 
    createReviews
};
