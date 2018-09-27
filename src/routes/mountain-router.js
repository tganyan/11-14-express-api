'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Mountain = require('../model/mountains');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/mountains', jsonParser, (request, response, next) => {
  return new Mountain(request.body).save()
    .then((savedMountain) => {
      logger.log(logger.INFO, 'Responding with a 200 status code and a json object');
      return response.json(savedMountain);
    })
    .catch(next);
});

router.get('/api/mountains/:id', (request, response, next) => {
  return Mountain.findById(request.params.id)
    .then((mountain) => {
      if (mountain) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a mountain');
        return response.json(mountain);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Mountain not found');
      return next(new HttpError(404, 'mountain not found'));
    })
    .catch(next);
});

router.delete('/api/mountains/:id', (request, response, next) => {
  return Mountain.findByIdAndDelete(request.params.id)
    .then((mountain) => {
      if (mountain) {
        logger.log(logger.INFO, 'Mountain has been found and removed.');
        return response.sendStatus(204);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Mountain not Found');
      return next(new HttpError(404, 'mountain not found'));
    })
    .catch(next);
});

router.put('/api/mountains/:id', jsonParser, (request, response, next) => {
  return Mountain.findByIdAndUpdate(request.params.id)
    .then((updatedMountain) => {
      if (updatedMountain) {
        logger.log(logger.INFO, 'Mountain has been found and updated.');
        return response.json(updatedMountain);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Mountain not Found');
      return next(new HttpError(404, 'mountain not found'));
    })
    .catch(next);
});
