'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const regionMock = require('./lib/region-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/regions`;

describe('/api/regions', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(regionMock.p_CleanRegionMocks);

  test('should respond with 200 status code and a new json region', () => {
    const originalRequest = {
      name: faker.lorem.words(1),
      climate: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.climate).toEqual(originalRequest.climate);
          expect(response.body.name).toEqual(originalRequest.name);

          expect(response.body.timestamp).toBeTruthy();
          expect(response.body._id.toString()).toBeTruthy();
        });
  });

  // test('should respond with 200 status code and a json note if there is a matching id', () => {
  //   let savedRegionMock = null;
  //   return regionMock.p_CreateRegionMock()
  //       .then((createdRegionMock) => {
  //         savedRegionMock = createdRegionMock;
  //         return superagent.get(`${API_URL}/${createdRegionMock._id}`);
  //       })
  //       .then((getResponse) => {
  //         expect(getResponse.status).toEqual(200);
  //
  //         expect(getResponse.body.timestamp).toBeTruthy();
  //         expect(getResponse.body._id.toString()).toEqual(savedRegionMock._id.toString());
  //         expect(getResponse.body.name).toEqual(savedRegionMock.name);
  //       });
  // });
});