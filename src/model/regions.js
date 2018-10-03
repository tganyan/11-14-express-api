'use strict';

const mongoose = require('mongoose');

const regionSchema = mongoose.Schema({
      timestamp: {
        type: Date,
        default: () => new Date(),
      },
      name: {
        type: String,
        required: true,
        unique: true,
      },
      climate: {
        type: String,
        required: true,
      },
      mountains: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'mountain',
        },
      ],
    },
    {
      usePushEach: true,
    });

module.exports = mongoose.model('region', regionSchema);