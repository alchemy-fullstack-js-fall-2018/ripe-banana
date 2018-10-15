const mongoose = require('mongoose');
const { Schema } = mongoose;

const filmSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    studio: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Studio',
        required: true
    },
    released: {
        type: Number, 
        required: true,
        min: 4, 
        max: 4
    }, 
    cast: [{
        _id: false,
        role: String,
        actor: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'Actor', 
            required: true
        }
    }]
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
