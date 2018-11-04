const actors = [
    {
        name: 'Matt Diamond',
        dob: new Date('11-11-1911'),
        pob: 'Sweden'
    },
    {
        name: 'Susan Surandin',
        dob: new Date('04-14-1985'),
        pob: 'Miami'
    },
    {
        name: 'Perpetually Unemployed',
        dob: new Date('12-12-1912'),
        pob: 'Canada'
    }
];

const studios = [
    {
        name: 'YuraqYana Studios',
        address: {
            city: 'Lima',
            state: 'Lima',
            country: 'Peru'
        }
    },
    {
        name: 'Pixar',
        address: {
            city: 'Palo Alto',
            state: 'CA',
            country: 'USA'
        }
    },
    {
        name: 'Defunct Studio',
        address: {
            city: 'Pasadena',
            state: 'CA',
            country: 'USA'
        }
    }
];

const reviewers = [
    { 
        name: 'George Watchington', 
        company: 'Patriot Films',
        email: 'georgieHotStuff@hotmail.com',
        clearPassword: 'georgessecret',
        roles: ['admin'] 
    },
    { 
        name: 'Abraham Linkoln', 
        company: 'Great Conflict Productions',
        clearPassword: 'fourScoreAndPasswordAgo',
        email: 'Abe1809@askjeeves.com',
        roles: ['editor']
    }
];

module.exports = {
    actors,
    studios,
    reviewers
};