const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');


describe('validates a vertical slice of the Actor route', () => {
   
    let actors =  [{
        name: 'Anna Peel',
        dob: new Date(),
        pob: 'Brazil'
    },
    {
        name: 'Lud Orange',
        dob: new Date(),
        pob: 'Florida'
    },
    {
        name: 'Ocado Pitt', 
        dob: new Date(),
        pob: 'Mexico'
    }];
    
    let createdActors;
        
    const createActor = actor => {
        return request(app)
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    };
        
    beforeEach(() => {
        return dropCollection('actors');
    });
        
    beforeEach(() => {
        return Promise.all(actors.map(createActor)).then(actorsRes => {
            createdActors = actorsRes;
        });
    });


    it('Posts to Actor', () => {
        return request(app)
            .post('/api/actors')
            .send({
                name: 'Anna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Anna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });            
            });
    });

    it('gets all Actors', () => {
        return request(app)
            .get('/api/actors')
            .then(res => {
                expect(res.body).toContainEqual(createdActors[0]);
                expect(res.body).toContainEqual(createdActors[1]);
                expect(res.body).toContainEqual(createdActors[2]);
            });
    });

    it('gets a actor by id', () => {
        return request(app)
            .get(`/api/actors/${createdActors[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(createdActors[1]);
            });

    });

    it('deletes a actor by id', () => {
        return request(app)
            .delete(`/api/actors/${createdActors[1]._id}`)
            .then(modifiedList => {
                expect(modifiedList.body).toEqual({ removed: true });
            });
    });

    it('updates a actor by id', () => {
        return request(app)
            .put(`/api/actors/${createdActors[1]._id}`)
            .send({
                name: 'Ananna Peel',
                dob: new Date(),
                pob: 'Brazil'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    name: 'Ananna Peel',
                    dob: expect.any(String),
                    pob: 'Brazil'
                });            
            });
    });

});














//start with Studios, Actors, Reviewer, (thses do not refrence other models)
//write model, route and test, vertical slices
//then make Film which refrences Studio and Actors(cast array)
//then => Review relies on Film and Reviewers

