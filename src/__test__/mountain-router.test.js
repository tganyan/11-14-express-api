'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const mountainMock = require('./lib/mountain-mock');
const regionMock = require('./lib/region-mock')

const API_URL = `http://localhost:${process.env.PORT}/api/mountains`;

describe('api/mountains', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(mountainMock.p_CleanMountainMocks);

  describe('testing post request', () => {
    test('should respond with 200 status code and a new json mountain', () => {
      let savedRegion = null;

      return regionMock.p_CreateRegionMock()
          .then((createdRegion) => {
            savedRegion = createdRegion;
            return savedRegion;
          });

      const originalRequest = {
        name: faker.lorem.words(1),
        elevation: faker.random.number(),
        region: savedRegion._id,
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(originalRequest.name);
          expect(response.body.elevation).toEqual(originalRequest.elevation);
          expect(response.body._id.toString()).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });

    test('should respond with 400 status code if there is no name', () => {
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send({
          elevation: '7600′',
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('testing put request', () => {
    test('should respond with 200 status code and updated json mountain', () => {
      let savedMountainMock = null;
      return mountainMock.p_CreateMountainMock()
        .then((createdMountainMock) => {
          savedMountainMock = createdMountainMock;
          return superagent.put(`${API_URL}/${createdMountainMock.mountains._id}`)
            .send({
              name: 'Pilchuck YO!',
            });
        })
        .then((getResponse) => {
          expect(getResponse.body.name).toEqual('Pilchuck YO!');
          expect(getResponse.body.elevation).toEqual(savedMountainMock.mountains._doc.elevation);
        });
    });
  });

  describe('testing bad routes', () => {
    test('should respond with 404 status code', () => {
      return mountainMock.p_CreateMountainMock()
          .then(() => {
            return superagent.get(`${API_URL}/somebadroute`);
          })
          .then(Promise.reject)
          .catch((getResponse) => {
            expect(getResponse.status).toEqual(404);
          });
    });
    test('should respond with 400 for valid request with no id', () => {
      return mountainMock.p_CreateMountainMock()
          .then(() => {
            return superagent.get(`${API_URL}/`);
          })
          .then(Promise.reject)
          .catch((getResponse) => {
            expect(getResponse.status).toEqual(400);
          });
    });
  });

  // describe('testing get methods', () => {
  //   test('should respond with 200 status code if there is a matching id', () => {
  //     let savedMountainMock = null;
  //     return mountainMock.p_CreateMountainMock()
  //       .then((createdMountainMock) => {
  //         savedMountainMock = createdMountainMock;
  //         return superagent.get(`${API_URL}/${createdMountainMock.mountains._id}`);
  //       })
  //       .then((getResponse) => {
  //         expect(getResponse.status).toEqual(200);
  //         expect(getResponse.body.timestamp).toBeTruthy();
  //         expect(getResponse.body._id).toEqual(savedMountainMock);
  //         expect(getResponse.body.name).toEqual(savedMountainMock.name);
  //         expect(getResponse.body.elevation).toEqual(savedMountainMock.mountains._doc.elevation);
  //       });
  //   });
  // });

  // describe('testing delete requests', () => {
  //   test('should respond with 204 status code', () => {
  //     return mountainMock.p_CreateMountainMock()
  //       .then((createdMountainMock) => {
  //         return superagent.delete(`${API_URL}/${createdMountainMock._id}`);
  //       })
  //       .then((getResponse) => {
  //         expect(getResponse.status).toEqual(204);
  //       });
  //   });
  // });
});
