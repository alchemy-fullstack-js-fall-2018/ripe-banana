require('dotenv').config();
require('./lib/mongoose-connector');

const { createServer } = require('http');
const app = require('./lib/app');

const port = 7890;

const server = createServer(app);

server.listen(port, () => {
    console.log(`Listening on ${port}`);  /* eslint-disable-line no-console */
});