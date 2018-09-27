'use strict';

const mongoose = require('mongoose');

const mountainSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => Date(),
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  elevation: {
    type: Number,
    required: true,
    unique: true,
  },
})

module.exports = mongoose.model('mountain', mountainSchema);
