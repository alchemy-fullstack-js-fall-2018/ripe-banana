require('dotenv').config();
require('../../lib/util/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const app = require('../../lib/app');
const Actor = require('../../lib/models/Actor');
const Chance = require('chance');
const chance = new Chance();

const createActor = actor => {
    return Actor.create(actor);
};

const jsonify = args => JSON.parse(JSON.stringify(args));

const createActors = (count, arr) => {
    const actorPromises = Array.apply(null, { length: count }).map(() => {
        return createActor({
            name: chance.name(),
            dob: chance.date(),
            pob: chance.city()
        });
    });
    return Promise.all(actorPromises).then(actors => {
        arr.push.apply(arr, jsonify(actors));
    });
};

module.exports = {
    createActors
};
