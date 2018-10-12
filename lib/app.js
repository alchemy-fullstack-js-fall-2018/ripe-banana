
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/studios', require('./routes/studios'));
app.use('/api/actors', require('./routes/actors'));
app.use('/api/films', require('./routes/films'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/reviewers', require('./routes/reviewers'));

module.exports = app;
