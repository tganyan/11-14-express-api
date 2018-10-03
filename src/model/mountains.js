'use strict';

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const Region = require('./regions');

const mountainSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  elevation: {
    type: Number,
    required: true,
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'region',
  },
});

function mountainPreHook(done) {
  return Region.findById(this.region)
      .then((regionFound) => {
        if (!regionFound) {
          throw new HttpError(404, 'region not found');
        }
        regionFound.mountains.push(this._id);
        return regionFound.save();
      })
      .then(() => done())
      .catch(error => done(error));
}

const mountainPostHook = (document, done) => {
  return Region.findById(document.region)
      .then((regionFound) => {
        if (!regionFound) {
          throw new HttpError(500, 'region not found');
        }
        regionFound.mountains = regionFound.mountains.filter((mountain) => {
          return mountain._id.toString() !== document._id.toString();
        });
        return regionFound.save();
      })
      .then(() => done())
      .catch(error => done(error));
};

mountainSchema.pre('save', mountainPreHook);
mountainSchema.post('remove', mountainPostHook);

module.exports = mongoose.model('mountain', mountainSchema);