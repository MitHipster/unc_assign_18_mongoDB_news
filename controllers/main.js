/*jslint esversion: 6, browser: true*/
// Dependencies
const express = require('express');
// Require collection models
const Remark = require('../models/Remark.js');
const Article = require('../models/Article.js');
// Require request and cheerio to make scraping possible
const request = require('request');
const cheerio = require('cheerio');

// Create `router` for app and export `router` at end of file.
const router = express.Router();

// Function to check if object has any empty values
let hasEmpty = result => {
  for (let key in result) {
    if (result[key].length === 0)
    return true;
  }
  return false;
};

// At this route, server will scrape data from site and save it to mongoDB.
router.get('/test', (req, res) => {
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
      result.image = $(element).find('.wide-thumb img').attr('src');
      result.date = $(element).parent().siblings('.story-footer').find('.dateline').text().trim();
      // Call hasEmpty function
      if (!hasEmpty(result)) {
        // If no empty values, use Article model to create a new entry
        let entry = new Article(result);
        // Save entry to mongoDB
        entry.save( (err, doc) => {
          if (err) throw err;
        });
      }
    });
  });
  res.send('Scrape complete.');
});

// Export routes for server.js to use
module.exports = router;
