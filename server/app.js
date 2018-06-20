const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
import morgan from 'morgan';

//Set native promises as mongoose promise
mongoose.Promise = global.Promise;

//MongoDB Connection
mongoose.connect('mongodb://localhost:27017/digi-vaate', err => {
    if (err) {
        console.error('Make sure Mongodb is installed, running, port is set to 27017 and db /"digi-vaate/" exist');
        throw err;
    }
});

//handle cross origin requests
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
*/

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Log requests
app.use(morgan('dev'));
//Serve front end
app.use(express.static(path.resolve(__dirname, '../client/')));

//Back-end routes
app.use('/api/collection', require('./routes/collectionRoute'));
app.use('/api/color', require('./routes/colorRoute'));
app.use('/api/material', require('./routes/materialRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/season', require('./routes/seasonRoute'));

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
   res.json({
       error: {
           message: error.message
       }
   });
});

module.exports = app;
