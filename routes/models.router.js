const express = require('express');
const routesUsers = require('./users.routes');
const routesCountries = require('./countries.routes');

// const isAuthenticatedByPassportJwt = require('../libs/passport');

const routesAuth = require('./auth.routes');

function routerModels(app) {
  const router = express.Router();

  app.use('/api/v1', router);
  router.use('/auth', routesAuth);
  router.use('/countries', routesCountries);
  router.use('/users', routesUsers);
}

module.exports = routerModels;
