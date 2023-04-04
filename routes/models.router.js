const express = require('express')

const passportAuth = require('../libs/passport')
const isAdmin = require( '../middlewares/isAdmin.middleware' )
const isSameUser = require( '../middlewares/isSameUser.middleware' )

const routesAuth = require('./auth.routes');
const routesCities = require('./cities.routes');
const routesCountries = require('./countries.routes');
const routesPublicationsTypes = require('./publicationsTypes.routes');
const routesPublications = require('./publications.routes');
const routesRoles = require('./roles.routes');
const routesStates = require('./states.routes');
const routesTags = require('./tags.routes');
const routesUsers = require('./users.routes');

function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)

  router.use('/publications', routesPublications)
  
  router.use( passportAuth, isAdmin, isSameUser )

  router.use('/cities', routesCities)
  router.use('/countries', routesCountries)
  router.use('/publications-types', routesPublicationsTypes)
  router.use('/roles', routesRoles)
  router.use('/states', routesStates)
  router.use('/tags', routesTags)
  router.use('/users', routesUsers)
}

module.exports = routerModels
