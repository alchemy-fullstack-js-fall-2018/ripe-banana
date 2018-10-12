const express = require('express');
const app = express();
const { handler } = require('./util/errors');
const { HttpError } = require('./util/errors');

app.use(express.static('public'));
app.use(express.json());

app.use('/api/actors', require('./routes/actors'));
app.use('/api/films', require('./routes/films'));
app.use('/api/reviewers', require('./routes/reviewers'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/studios', require('./routes/studios'));

app.get('/error', (req, res) => {
    throw new HttpError({ code: 505, message: 'myHttpError' });
});

app.use((req, res) => { /* eslint-disable-next-line no-console */
    console.log('This is 404'); 
    res.status(404);
    res.end('404 Not Found');
});

app.use(handler);

module.exports = app;
