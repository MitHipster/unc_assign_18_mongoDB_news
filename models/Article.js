/*jslint esversion: 6, browser: true*/
// Dependencies
const mongoose = require('mongoose');
// Create schema class
const Schema = mongoose.Schema;

// Define article schema
const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  // Link to Remark model
  remark: {
    type: Schema.Types.ObjectId,
    ref: 'Remark'
  }
});

// Create model with schema
const Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;
