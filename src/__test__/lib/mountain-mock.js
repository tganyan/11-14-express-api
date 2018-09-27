'use strict';

const faker = require('faker');
const Mountain = require('../../model/mountains');

const mountainMock = module.exports = {};

mountainMock.p_CreateMountainMock = () => {
  return new Mountain({
    name: faker.lorem.words(2),
    elevation: faker.random.number(),
  }).save();
};

mountainMock.p_CleanMountainMocks = () => {
  return Mountain.remove({});
};
