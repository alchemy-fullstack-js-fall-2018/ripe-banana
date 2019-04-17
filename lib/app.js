const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler } = require('./util/errors');

app.use(
    morgan('dev', {
        skip() {
            return process.env.NODE_ENV === 'test';
        }
    })
);

app.use(express.json());

app.use('/api/studios', require('./routes/studios'));
app.use('/api/reviewers', require('./routes/reviewers'));
app.use('/api/actors', require('./routes/actors'));
app.use('/api/films', require('./routes/films'));
app.use('/api/reviews', require('./routes/reviews'));

app.use(handler);

module.exports = app;
