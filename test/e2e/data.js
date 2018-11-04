const reviewersData = [
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

const actorsData = [
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

const studiosData = [
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

const filmsData = [
    {
        title: 'The Programinator',
        // studio:
        released: 1984,
        cast: [
            { role: 'Chief Troublemaker' }, // actor:
            { role: 'Sidekick' } // actor:
        ]
    },
    {
        title: 'Thelma and Luigi',
        // studio: 
        released: 1972,
        cast: [
            { role: 'Thelma' }, // actor:
            { role: 'Luigi' } // actor:
        ]
    }
];

const reviewsData = [
    {
        rating: 5,
        // reviewer: 
        text: 'Amazeballs!',
        // film:
    },
    {
        rating: 1,
        // reviewer: 
        text: 'I want the last 1.5 hours of my life back.',
        // film: 
    }
];

module.exports = {
    actorsData,
    studiosData,
    reviewersData,
    filmsData,
    reviewsData
};