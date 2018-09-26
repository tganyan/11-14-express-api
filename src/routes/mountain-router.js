'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Mountain = require('../model/mountains');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

const storageById = [];
const storageByHash = {};

router.post('/api/mountains', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/mountains');

  if (!request.body) {
    return next(new HttpError(400, 'body is required'));
  }

  if (!request.body.name) {
    return next(new HttpError(400, 'name is required'));
  }

  if (!request.body.elevation) {
    return next(new HttpError(400, 'elevation is required'));
  }

  const mountain = new Mountain(request.body.name, request.body.elevation);
  storageById.push(mountain.id);
  storageByHash[mountain.id] = mountain;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json object');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);

  return response.json(mountain);
});

router.get('/api/mountains/:id', (request, response, next) => {
  logger.log(logger.INFO, `Attempting to get an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found. Responding with json data.`);
    return response.json(storageByHash[request.params.id]);
  }

  return next(HttpError(400, 'That mountain was not found'));
});

router.delete('/api/mountains/:id', (request, response, next) => {
  logger.log(logger.INFO, `Attempting to delete an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found and removed.`);
    delete storageByHash[request.params.id];
    storageById.splice(storageById.indexOf(request.params.id));
    return response.sendStatus(204);
  }

  return next(new HttpError(404, 'That mountain was not found'));
});

router.put('/api/mountains/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Processing a PUT request on /api/mountains/${request.params.id}`);

  if (storageByHash[request.params.id]) {
    if (request.body.name) {
      storageByHash[request.params.id].name = request.body.name;
    }
    if (request.body.elevation) {
      storageByHash[request.params.id].elevation = request.body.elevation;
    }
    return response.json(storageByHash[request.params.id]);
  }

  return next(new HttpError(404, 'That mountain was not found'));
});
