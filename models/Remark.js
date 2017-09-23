/*jslint esversion: 6, browser: true*/
// Dependencies
const mongoose = require('mongoose');
// Create schema class
const Schema = mongoose.Schema;

// Define remark schema
const RemarkSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

// Create model with schema
const Remark = mongoose.model('Remark', RemarkSchema);

// Export the model
module.exports = Remark;
