/*jslint esversion: 6, browser: true*/
// Dependencies
const mongoose = require('mongoose');
// Create schema class
const Schema = mongoose.Schema;

// Define article schema
const ArticleSchema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  headline: {
    type: String,
    trim: true,
    required: true
  },
  summary: {
    type: String,
    trim: true,
    required: true
  },
  byline: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  // Link to Remark model
  remarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Remark'
  }]
});

// Create model with schema
const Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;
