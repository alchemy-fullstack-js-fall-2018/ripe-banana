const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const request = require('supertest');

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

const createActorsArr = () => {

    let actors = [
        {
            name: chance.name({ suffix: true }),
            dob: chance.date(),
            pob: chance.word()
        },
        {
            name: chance.name({ suffix: true }),
            dob: chance.date(),
            pob: chance.word()
        },
        {
            name: chance.name({ prefix: true }),
            dob: chance.date(),
            pob: chance.word()
        },

    ];

    const createActor = actor => {
        return request(app)
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    };

    let createdActors;
    
    Promise.all(actors.map(createActor))
        .then(actorRes => createdActors = actorRes);

};

module.exports = {
    getErrors
};
