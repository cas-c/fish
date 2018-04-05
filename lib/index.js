const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config');
const User = require('./models/user');
mongoose.connect(config.db.url);

const app = express();
app.set('secret', config.secret);
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'static/index.html'));
});

app.use('/api/fish', require('./api/fish'));

app.use('/api/discord', require('./api/discord'));

app.use((err, req, res, next) => {
    switch(err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message
            });
    }
});

app.listen(3000, () => {
    console.info('Running on port 3000');
});
