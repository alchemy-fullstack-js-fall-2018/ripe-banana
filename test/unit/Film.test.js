const { getErrors } = require('./helpers');
const { dropCollection } = require('../e2e/db');
const Film = require('../../lib/models/Film');
const request = require('supertest');
const app = require('../../lib/app');



describe('Film Model', () => {

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

    let studios =  [{
        name: 'Compost Cinema', 
        address: {
            city: 'Portland',
            state: 'OR',
            country: 'United States'
        }
    },
    {
        name: 'Compost Cinema2', 
        address: {
            city: 'Portland2',
            state: 'OR',
            country: 'United States'
        }
    },
    {
        name: 'Compost Cinema3', 
        address: {
            city: 'Portland3',
            state: 'OR',
            country: 'United States'
        }
    },
    ];
    
    let createdStudios;
        
    const createStudio = studio => {
        return request(app)
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);
    };
        
    beforeEach(() => {
        return dropCollection('studios');
    });
        
    beforeEach(() => {
        return Promise.all(studios.map(createStudio)).then(studiosRes => {
            createdStudios = studiosRes;
        });
    });


    it('returns the Film Schema Model', () => {
        const data = {
            title: 'Bladecrawler',
            studio: createdStudios[0]._id,
            released: 1991,
            cast: [{
                role: 'lead',
                actor: createdActors[0]._id
            }]
        };

        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ _id: expect.any(Object), cast: [{ role: 'lead', actor: expect.any(Object), _id: expect.any(Object) }], released: 1991, studio: expect.any(Object), title: expect.any(String) });
    });

    it('validates that a name has been passed', () => {
        const film = new Film({
            released: 1991
        });

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
    });
});
