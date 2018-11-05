const express = require('express');
const app = express();
const bearerToken = require('./util/bearer-token');
const ensureAuth = require('./util/ensure-auth');


app.use(express.static('public'));
app.use(express.json());

const authRoutes = require('./routes/auth');
const actors = require('./routes/actors');
const studios = require('./routes/studios');
const reviewers = require('./routes/reviewers');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use(bearerToken);

app.use('/api/auth', authRoutes);
app.use('/api/actors', actors);
app.use('/api/studios', studios);
app.use('/api/reviewers', reviewers);
app.use('/api/films', films);
app.use('/api/reviews', reviews);

app.use(ensureAuth);

const { handler, api404 } = require('./util/errors');
app.use('/api', api404);
app.use((req, res) => res.status(404).send('Not Found'));
app.use(handler);

module.exports = app;
