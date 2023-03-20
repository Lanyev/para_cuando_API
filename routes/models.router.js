const express = require('express');

// const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesAuth = require('./auth.routes');
const routesCities = require('./cities.routes');
const routesCountries = require('./countries.routes');
const routesStates = require('./states.routes');
const routesUsers = require('./users.routes');

function routerModels(app) {
  const router = express.Router();

  app.use('/api/v1', router);
  router.use('/auth', routesAuth);
  router.use('/cities', routesCities);
  router.use('/countries', routesCountries);
  router.use('/states', routesStates);
  router.use('/users', routesUsers);
  
}

module.exports = routerModels;
