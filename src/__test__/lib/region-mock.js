'use strict';

const faker = require('faker');
const Region = require('../../model/regions');

const regionMock = module.exports = {};

regionMock.p_CreateRegionMock = () => {
  return new Region({
    name: faker.lorem.words(1),
    climate: faker.lorem.words(1),
  }).save();
};

regionMock.p_CleanRegionMocks = () => {
  return Region.remove({});
};
