const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');
const { dropCollection } = require('../util/db');
const { getReviewerTokens, getStudios, getFilms } = require('./create');

describe('end to end studo testing', () => {

    const rh = new ResourceHelper;

    // beforeEach(() => rh.wrapper('studios', 3));

    beforeEach(() => {
        return (async() => {
            await dropCollection('films');
            await rh.init('films', 104);

            await rh.wrapper('actors', 2);
            await rh.assign('films', 'createdActors', 'cast[0].actor');

            await rh.wrapper('studios', 2);
            await rh.assign('films', 'createdStudios', 'studio');
            
            await rh.taskRunner('films');
        })();
    });

    it('this creates a studio if user an admin', () => {
        
        const reviewerTokens = getReviewerTokens();

        const studio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };

        return request(app)
            .post('/studios')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(studio)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...studio,  
                    _id: expect.any(String),
                });
            });
    });

    it('won\'t create a studio if user is not an admin', () => {
        const reviewerTokens = getReviewerTokens();
        const newStudio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };
        
        return request(app)
            .post('/studios')
            .set('Authorization', `Bearer ${reviewerTokens[1]}`)
            .send(newStudio)
            .then(result => {
                expect(result.body).toEqual({});
            });
    });


    it('gets all studios', () => {
        return request(app)
            .get('/studios')
            .then(({ body }) => {
                rh.createdStudios.forEach(createdStudio => {
                    expect(body).toContainEqual({ _id: createdStudio._id, name: createdStudio.name });
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/studios/${rh.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ ...rh.createdStudios[0], films: expect.any(Object) }));
    });

    it('deletes a studio by id', () => {
        
        // const studios = getStudios();
        const reviewerTokens = getReviewerTokens();

        let studio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };

        return (async() => {

            await request(app)
                .post('/studios')
                .send(studio)
                .then(({ body }) => studio.id = body._id);
            await request(app)
                .delete(`/studios/${studio.id}`)
                .set('Authorization', `Bearer ${reviewerTokens[0]}`)
                .then(({ body }) => expect(body).toEqual({ removed: true }));

        })();
    });

    it('does not delete a studio if there are films', () => {
        
        // const studios = getStudios();
        const reviewerTokens = getReviewerTokens();

        return request(app)
            .delete(`/studios/${rh.createdStudios[0]._id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(({ body }) => expect(body).toEqual({ removed: false }));
    });
});
