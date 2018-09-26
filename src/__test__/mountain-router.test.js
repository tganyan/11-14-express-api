'use strict';

process.env.PORT = 3000;

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}/api/mountains`;

describe('api/mountains', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('testing post request', () => {
    test('should respond with 200 status code and a new json mountain', () => {
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send({
          name: 'Pilchuck',
          elevation: '5,341′',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Pilchuck');
          expect(response.body.elevation).toEqual('5,341′');
          expect(response.body.id).toBeTruthy();
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
      const originalRequest = {
        name: faker.lorem.words(2),
        elevation: faker.random.number(),
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((postResponse) => {
          originalRequest.id = postResponse.body.id;
          return superagent.put(`${API_URL}/${postResponse.body.id}`)
            .send({
              name: 'Pilchuck YO!',
            });
        })
        .then((getResponse) => {
          expect(getResponse.body.name).toEqual('Pilchuck YO!');
          expect(getResponse.body.elevation).toEqual(originalRequest.elevation);
        });
    });
  });

  describe('testing get methods', () => {
    test('should respond with 200 status code if there is a matching name', () => {
      const originalRequest = {
        name: faker.lorem.words(2),
        elevation: faker.random.number(),
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((postResponse) => {
          originalRequest.id = postResponse.body.id;
          return superagent.get(`${API_URL}/${postResponse.body.id}`);
        })
        .then((getResponse) => {
          expect(getResponse.body.timestamp).toBeTruthy();
          expect(getResponse.body.id).toEqual(originalRequest.id);
          expect(getResponse.body.name).toEqual(originalRequest.name);
          expect(getResponse.body.elevation).toEqual(originalRequest.elevation);
        });
    });
  });

  describe('testing delete requests', () => {
    test('should respond with 204 status code', () => {
      const originalRequest = {
        name: faker.lorem.words(2),
        elevation: faker.random.number(),
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((postResponse) => {
          originalRequest.id = postResponse.body.id;
          return superagent.delete(`${API_URL}/${postResponse.body.id}`);
        })
        .then((getResponse) => {
          expect(getResponse.status).toEqual(204);
        });
    });
  });
});
