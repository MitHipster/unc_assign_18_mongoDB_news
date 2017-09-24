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

// At this route, server will scrape data from site and save it to mongoDB.
app.get('/test', (req, res) => {
  // Send request for website
  request('https://www.nytimes.com/section/us', (error, res, html) => {
    // Load html into cheerio and save to $ variable to serve as a shorthand for cheerio's selector commands (similar to the way jQuery works)
    let $ = cheerio.load(html);
    // Iterate over each story-link block to retrieve article information
    $('a.story-link').each( (i, element) => {
      // Object to hold scraped data
      let result = {};
      result.url = $(element).attr('href');
      result.headline = $(element).find('h2.headline').text().trim();
      result.summary = $(element).find('p.summary').text().trim();
      result.byline = $(element).find('p.byline').text().trim();
      console.log(result);
      // Using Article model, create a new entry
      let entry = new Article(result);
      // Save entry to mongoDB
      entry.save( (err, doc) => {
        if (err) throw err;
        console.log(doc);
      });
    });
  });
  res.send('Scrape complete.');
});

// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
