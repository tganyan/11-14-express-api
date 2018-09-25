'use strict';

const logger = require('./logger');

const routeHandlers = {
  POST: {},
  GET: {},
  PUT: {},
  DELETE: {},
};

const router = module.exports = {};

const logRouteAndCallback = (method, route) => {
  logger.log(logger.INFO, `Adding a ${method} handler on the '${route}' route`);
  // logger.log(logger.INFO, callback.toString());
};

router.get = (route, callback) => {
  routeHandlers.GET[route] = callback;
  logRouteAndCallback('GET', route, callback);
};

router.post = (route, callback) => {
  routeHandlers.POST[route] = callback;
  logRouteAndCallback('POST', route, callback);
};

router.put = (route, callback) => {
  routeHandlers.PUT[route] = callback;
  logRouteAndCallback('PUT', route, callback);
};

router.delete = (route, callback) => {
  routeHandlers.DELETE[route] = callback;
  logRouteAndCallback('DELETE', route, callback);
};

router.findAndExecuteRoutes = (request, response) => {
  logger.log(logger.INFO, 'Routing a request');
  requestParser.parseASYNC(request)
    .then((parsedRequest) => {
      const handler = routeHandlers[parsedRequest.method][parsedRequest.url.pathname];
      logger.log(logger.INFO, 'Found the following handler');
      logger.log(logger.INFO, handler.toString());

      if (handler) {
        return handler(parsedRequest, response);
      }

      response.writeHead(404);
      response.end();
      return undefined;
    }).catch(() => {
      logger.log(logger.INFO, 'Responding with 400 status code');
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request');
      response.end();
      return undefined;
    });
};
