'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Region = require('../model/regions');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/regions', jsonParser, (request, response, next) => {
  return new Region(request.body).save()
      .then((savedRegion) => {
        logger.log(logger.INFO, 'Responding with a 200 status code');
        return response.json(savedRegion);
      })
      .catch(next);
});

router.get('/api/regions/:id', (request, response, next) => {
  return Region.findById(request.params.id)
      .then((region) => {
        if (region) {
          logger.log(logger.INFO, 'Responding with a 200 status code and a region');
          return response.json(region);
        }
        logger.log(logger.INFO, 'Responding with a 404 status code. Region not Found');
        return next(new HttpError(404, 'region not found'));
      })
      .catch(next);
});