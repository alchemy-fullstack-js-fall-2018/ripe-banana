const { getErrors } = require('./helpers');
const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');

describe('film model', () => {
    const data = {
        title: 'National Treasure',
        studio: 'Walt Disney Pictures',
        released: 2004,
        cast: [{
            role: 'Benjamin Gates',
            actor: actors.find({actors._id: {} })
        }]
    }
});
