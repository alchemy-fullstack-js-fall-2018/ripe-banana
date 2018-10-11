const express = require('express');
const app = express();
const morgan = require('morgan');

// app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const tours = require('./routes/tours');
app.use('/api/tours', tours);

const { handler, api404 } = require('./util/errors');
app.use('/api', api404);
app.use((req, res) => res.status(404).send('Not Found'));
app.use(handler);

module.exports = app;
