const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const studios = require('./routes/studios');
app.use('/studios', studios);

module.exports = app;