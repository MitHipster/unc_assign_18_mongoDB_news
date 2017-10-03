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

// Route to load unsaved articles when site first loads
router.get('/', (req, res, next) => {
  Article.find({ saved: false })
  .sort({ date: -1 })
  .exec((err, data) => {
    if (err) throw err;
    res.render('index', {
      content: {
        saved: false,
        data: data
      }
    });
  });
});

// At this route, server will scrape data from site and save it to mongoDB.
router.get('/update', (req, res, next) => {
  // Send request for website
  request('https://www.nytimes.com/section/us', (error, response, html) => {
    // Load html into cheerio and save to $ variable to serve as a shorthand for cheerio's selector commands (similar to the way jQuery works)
    let $ = cheerio.load(html);
    // Iterate over each story-link block to retrieve article information
    $('#latest-panel a.story-link').each( (i, element) => {
      // Object to hold scraped data
      let result = {};
      result.url = $(element).attr('href');
      result.headline = $(element).find('h2.headline').text();
      result.summary = $(element).find('p.summary').text();
      result.byline = $(element).find('p.byline').text();
      result.image = $(element).find('.wide-thumb img').attr('src');
      result.date = $(element).parent().siblings('.story-footer').find('.dateline').attr('datetime') + 'T12:00:00.000Z';
      // Call hasEmpty function
      if (!hasEmpty(result)) {
        // If no empty values, use Article model to create a new entry
        let entry = new Article(result);
        // Save entry to mongoDB
        entry.save( (err, data) => {
          if (err && err.code !== 11000) throw err;
        });
      }
    });
    res.redirect('/');
  });
});

router.get('/saved', (req, res, next) => {
  Article.find({ saved: true })
  .sort({ date: -1 })
  // Populate all of the notes associated with saved articles
  .populate('remarks')
  .exec((err, data) => {
    if (err) throw err;
    res.render('index', {
      content: {
        saved: true,
        data: data
      }
    });
  });
});

// Dynamic route used to save articles
router.get('/saved/:id', (req, res) => {
  Article.findByIdAndUpdate(req.params.id, {$set: { saved: true }}, (err, data) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.post('/notes/:id', (req, res) => {
  let entry = new Remark(req.body);
  entry.save( (err, data) => {
    if (err) throw err;
    Article.findByIdAndUpdate(req.params.id, {$push: { 'remarks': data._id }}, { new: true })
    .exec( (err, data) => {
      if (err) throw err;
      res.redirect('/saved');
    });
  });
});

router.get('/removed/:id', (req, res) => {
  Article.findByIdAndRemove(req.params.id).exec()
  .then( data => {
    Remark.remove({ '_id': {$in: data.remarks }}).exec();
  }).then( () => {
    res.redirect('/saved');
  }).catch( err => {
    if (err) throw err;
  });
});

// Export routes for server.js to use
module.exports = router;
