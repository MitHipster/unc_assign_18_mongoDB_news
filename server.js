/*jslint esversion: 6, browser: true*/
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');
const routes = require('./controllers/main.js');

// Set mongoose to leverage built in ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// Use logger in dev environment
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public folder a static directory
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/headlinesDb');
const db = mongoose.connection;

// Show any mongoose connection errors
db.on('error', error => {
  console.log('Mongoose error: ', error);
});

// Show message if mongoose successfully connects
db.once('open', () => {
  console.log('Mongoose connection successful.');
});

// Add handlebars engine to express middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'handlebars');

// Open site at root
app.use('/', routes);

// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
