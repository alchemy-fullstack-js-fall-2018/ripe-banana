const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(bearerToken);

const auth = require('./routes/auth');
app.use('/auth', auth);

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


module.exports = app;
