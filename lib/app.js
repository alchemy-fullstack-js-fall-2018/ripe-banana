const express = require('express');
const app = express();
const { handler } = require('./util/errors');
// const bearerToken = require('./util/bearer-token');
const ensureAuth = require('./util/ensure-auth');

app.use(express.json());
app.use(express.static('public'));

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');
const films = require ('./routes/films');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');

app.use('/studios', studios);
app.use('/actors', actors);
app.use('/reviewers', reviewers);
app.use('/films', films);
app.use('/reviews', reviews);
app.use('/auth', auth);

app.use(ensureAuth);

app.use((req, res) => {
    console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});
app.use(handler);


module.exports = app;
