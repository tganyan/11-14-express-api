'use strict';

const express = require('express');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');
const mountainRoutes = require('../routes/mountain-router');

const app = express();

app.use(loggerMiddleware);
app.use(mountainRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from default route (route was not found)');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const server = module.exports = {};
let internalServer = null;

// server.start = () => {
//   internalServer = app.listen(process.env.PORT, () => {
//     logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
//   });
// };

server.start = () => {
  internalServer = app.listen(3000, () => {
    logger.log(logger.INFO, 'Server is on at PORT: 3000');
  });
};

server.stop = () => {
  internalServer.close(() => {
    logger.log(logger.INFO, 'The server is off.');
  });
};
