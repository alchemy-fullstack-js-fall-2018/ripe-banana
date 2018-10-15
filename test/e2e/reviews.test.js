beforeEach(() => {
    return dropCollection('studios');
});
beforeEach(() => {
    return dropCollection('actors');
});
beforeEach(() => {
    return dropCollection('films');
});
beforeEach(() => {
    return dropCollection('reviewers');
});

let createdActors;
let createdStudios;
let createdFilms;
let createdReviewers;
let createdReview;

let actors =  [{
    name: 'Anna Peel',
    dob: new Date(),
    pob: 'Brazil'
},
{
    name: 'Lud Orange',
    dob: new Date(),
    pob: 'Florida'
}];

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
}];

let films =  [{
    title: 'Bladecrawler',
    released: 1991,
    cast: [{
        role: 'lead',
    }]
},
{
    title: 'Bladewalker',
    released: 1992,
    cast: [{
        role: 'Deckard',
    }]
}];

let reviewers =  [{
    name: 'CreatedReviewer1', 
    company: 'CreatedCompany1'
},
{
    name: 'CreatedReviewer2', 
    company: 'CreatedCompany2'

},
{
    name: 'CreatedReviewer3', 
    company: 'CreatedCompany3'

}
];
    
const createActor = actor => {
    return request(app)
        .post('/api/actors')
        .send(actor)
        .then(res => res.body);
};

const createStudio = studio => {
    return request(app)
        .post('/api/studios')
        .send(studio)
        .then(res => res.body);
};

const createFilm = film => {
    return request(app)
        .post('/api/films')
        .send(film)
        .then(res => res.body);
};

const createReviewer = reviewer => {
    return request(app)
        .post('/api/reviewers')
        .send(reviewer)
        .then(res => res.body);
};

beforeEach(() => {
    return Promise.all(actors.map(createActor)).then(actorsRes => {
        createdActors = actorsRes;
        films[0].cast[0].actor = createdActors[0]._id;
        films[1].cast[0].actor = createdActors[1]._id;
    });
});

beforeEach(() => {
    return Promise.all(studios.map(createStudio)).then(studiosRes => {
        createdStudios = studiosRes;
        films[0].studio = createdStudios[0]._id;
        films[1].studio = createdStudios[1]._id;
    });
});
    
beforeEach(() => {
    return Promise.all(films.map(createFilm)).then(filmsRes => {
        createdFilms = filmsRes;
    });
});

beforeEach(() => {
    return Promise.all(reviewers.map(createReviewer)).then(reviewersRes => {
        createdReviewers = reviewersRes;
    });
});