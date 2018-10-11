const express = require('express');
const app = express();

app.use(express.json());

const bananas = require('./routes/bananas');
app.use('/', bananas);

module.exports = app;