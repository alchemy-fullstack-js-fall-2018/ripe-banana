const request = require('supertest');
const app = require('../../lib/app');
const { getStudios, getFilms } = require('./helpers');

describe('validates a vertical slice of the Studio route', () => {

    it('Posts to Studio', () => {
        return request(app)
            .post('/api/studios')
            .send({
                name: 'Compost Cinema', 
                address: {
                    city: 'Portland',
                    state: 'OR',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Compost Cinema',
                    address: {
                        city: 'Portland',
                        state: 'OR',
                        country: 'United States'
                    }
                });            
            });
    });

    it('gets all Studios', () => {
        const createdStudios = getStudios();

        return request(app)
            .get('/api/studios')
            .then(res => {
                expect(res.body).toContainEqual({
                    _id: createdStudios[0]._id,
                    name: createdStudios[0].name
                });
                expect(res.body).toContainEqual({
                    _id: createdStudios[1]._id,
                    name: createdStudios[1].name
                });
                expect(res.body).toContainEqual({
                    _id: createdStudios[2]._id,
                    name: createdStudios[2].name
                });
            });
    });

    it('gets a studio by id', () => {
        const createdStudios = getStudios();
        const createdFilms = getFilms();

        return request(app)
            .get(`/api/studios/${createdStudios[1]._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: createdStudios[1]._id,
                    name: createdStudios[1].name,
                    address: createdStudios[1].address,
                    films: [{
                        _id: createdFilms[1]._id,
                        title: createdFilms[1].title
                    }]
                });
            });

    });

    it('deletes a studio by id', () => {
        const createdStudios = getStudios();

        return request(app)
            .delete(`/api/studios/${createdStudios[2]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('responds with an error when asked to delete a studio referenced in a film', () => {
        const createdStudios = getStudios();

        return request(app)
            .delete(`/api/studios/${createdStudios[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ Error: 'Cannot remove a studio referenced in a film' });
            });
    });

    it('updates a studio by id', () => {
        const createdStudios = getStudios();

        return request(app)
            .put(`/api/studios/${createdStudios[1]._id}`)
            .send({
                name: 'Compost Cinema5', 
                address: {
                    city: 'Portland5',
                    state: 'OR',
                    country: 'United States'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Compost Cinema5', 
                    address: {
                        city: 'Portland5',
                        state: 'OR',
                        country: 'United States'
                    }
                });
            });
    });

});




