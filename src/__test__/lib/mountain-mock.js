'use strict';

const faker = require('faker');
const regionMock = require('./region-mock');
const Mountain = require('../../model/mountains');


const mountainMock = module.exports = {};

mountainMock.p_CreateMountainMock = () => {
  const resultMock = {};

  return regionMock.p_CreateRegionMock()
      .then((createdRegionMock) => {
        resultMock.region = createdRegionMock;
        return new Mountain({
          name: faker.lorem.words(5),
          elevation: faker.random.number(),
          region: createdRegionMock._id,
        }).save();
      })
      .then((createdMountainMock) => {
        resultMock.mountains = createdMountainMock;
        return resultMock;
      });
};

mountainMock.p_CleanMountainMocks = () => {
  return Promise.all([
    Mountain.remove({}),
    regionMock.p_CleanRegionMocks(),
  ]);
};
