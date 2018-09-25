'use strict';

const uuid = require('uuid/v1');

class Mountain {
  constructor(name, elevation) {
    this.id = uuid();
    this.timestamp = new Date();
    this.name = name;
    this.elevation = elevation;
  }
}

module.exports = Mountain;
