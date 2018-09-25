'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const Mountain = require('../model/mountains');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

const storageById = [];
const storageByHash = {};

router.post('/api/mountains', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/mountains');

  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.name) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.elevation) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  const mountain = new Mountain(request.body.name, request.body.elevation);
  storageById.push(mountain);
  storageByHash[mountain.id] = mountain;
  return response.json(mountain);
});

router.get('/api/mountains/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing GET request on /api/mountains');
  logger.log(logger.INFO, `Attempting to get an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found. Responding with json data.`);
    return response.json(storageByHash[request.params.id]);
  }

  logger.log(logger.INFO, 'That mountain does not exist in our database. Responding with a 404 status code.');
  return response.sendStatus(404);
});

router.delete('/api/mountains/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing DELETE request on /api/mountains');
  logger.log(logger.INFO, `Attempting to delete an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found and removed.`);
    delete storageByHash[request.params.id];
    return response.sendStatus(200);
  }

  logger.log(logger.INFO, 'That mountain does not exist in our database. Responding with a 404 status code.');
  return response.sendStatus(404);
});

router.put('/api/mountains', (request, response) => {
  logger.log(logger.INFO, `Processing a PUT request on /api/mountains/${request.params.id}`);

  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.name) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.elevation) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  storageByHash[request.params.id] = {
    name: request.params.name,
    elevation: request.params.elevation,
  };
  return response.json(storageByHash[request.params.id]);
});
