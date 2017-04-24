const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helloApi = require('./hello');
const userApi = require('./user');
const Utils = require('./utils');

const PORT = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

console.log('');
Utils.mount(app, '/', helloApi);
Utils.mount(app, '/api/hello', helloApi);
Utils.mount(app, '/api/user', userApi);

app.listen(PORT, () => {
    console.log('');
    console.log(`Backend started at port ${PORT}`);
});