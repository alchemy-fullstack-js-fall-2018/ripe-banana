const { getErrors } = require('./helpers');
const Film = require('../../lib/models/Film');
const { Types } = require('mongoose');

describe('film model', () => {
    const data = {
        title: 'National Treasure',
        studio: 'Walt Disney Pictures',
        released: 2004,
        cast: [{
            role: 'Benjamin Gates',
            actor: Types.ObjectId()
        }]
    };
});
