const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid year`
        }
    },
    cast: [{
        role: {
            type: String,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]
    

});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
