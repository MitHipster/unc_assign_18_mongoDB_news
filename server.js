/*jslint esversion: 6, browser: true*/
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
// Require collection models
const Remark = require('./models/Remark.js');
const Article = require('./models/Article.js');
// Require request and cheerio to make scraping possible
const request = require('request');
const cheerio = require('cheerio');
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

// When you visit this route, the server will scrape data from the site and save it to mongoDB.
app.get('/test', (req, res) => {

});
