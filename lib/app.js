const express = require('express');
const app = express();
const { handler } = require('./util/errors');
const bearerToken = require('./util/bearer-token');

app.use(express.json());
app.use(express.static('public'));

app.use(bearerToken);

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');
const films = require ('./routes/films');
const reviews = require('./routes/reviews');

app.use('/studios', studios);
app.use('/actors', actors);
app.use('/reviewers', reviewers);
app.use('/films', films);
app.use('/reviews', reviews);

app.use(handler);

module.exports = app;
