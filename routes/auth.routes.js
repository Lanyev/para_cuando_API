const express = require('express');
const router = express.Router();

const verifySchema = require('../schemas/joiSchema.checker');
const {
  signupSchema,
  forgetPasswordSchema,
  restorePasswordSchema,
} = require('../schemas/auth.schemas');

const {
  signUp,
  logIn,
  forgetPassword,
  restorePassword,
  userToken,
} = require('../controllers/auth.controller');
const {passportAuth} = require('../libs/passport');

router.post('/login', logIn);

router.post('/sign-up', verifySchema(signupSchema, 'body'), signUp);

router.post(
  '/forget-password',
  verifySchema(forgetPasswordSchema, 'body'),
  forgetPassword
);

router.post(
  '/change-password/:token',
  verifySchema(restorePasswordSchema, 'body'),
  restorePassword
);

router.get('/me', passportAuth, userToken);

router.get('/testing', async (request, response, next) => {
  try {
    return response.status(200).json({
      results: {
        user: request.user,
        isAuthenticated: request.isAuthenticated(),
        isUnauthenticated: request.isUnauthenticated(),
        _sessionManager: request._sessionManager,
        authInfo: request.authInfo,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
