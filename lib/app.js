const express = require('express');
const app = express();
const morgan = require('morgan');

// app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const actors = require('./routes/actors');
app.use('/api/actors', actors);

const { handler, api404 } = require('./util/errors');
app.use('/api', api404);
app.use((req, res) => res.status(404).send('Not Found'));
app.use(handler);

module.exports = app;
