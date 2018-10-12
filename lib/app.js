const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const studios = require('./routes/studios');
const actors = require('./routes/actors');
// const reviewers = require('./routes/reviewers');

app.use('/studios', studios);
app.use('/actors', actors);
// app.use('/reviewers', reviewers);


module.exports = app;
