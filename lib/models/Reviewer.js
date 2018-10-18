const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `name` is required.']
    },
    company: { 
        type: String,
        required: [true, 'Path `company` is required']
    }
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
