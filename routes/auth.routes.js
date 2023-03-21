const express = require('express')
const router = express.Router()

const verifySchema = require('../schemas/joiSchema.checker')
const {
  signupSchema,
  forgetPasswordSchema,
  restorePasswordSchema,
} = require('../schemas/auth.schemas')

const {
  signUp,
  logIn,
  forgetPassword,
  restorePassword,
  userToken,
} = require('../controllers/auth.controller')

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: The email of the user.
 *        password:
 *          type: string
 *          description: The password of the user.
 *      required:
 *        - email
 *        - password
 *      example:
 *        email: example@examplemail.com
 *        password: examplepassword
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     description: Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The user was successfully logged in.
 *       401:
 *        description: Invalid credentials.
 */
router.post('/login', logIn)

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUp:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: The first name of the user.
 *         last_name:
 *           type: string
 *           description: The last name of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       example:
 *         first_name: Alan
 *         last_name: Perez
 *         email: alanperez@examplemail.com
 *         password: examplepassword
 */

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Sign Up
 *     description: Sign Up
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUp'
 *     responses:
 *       200:
 *         description: The user was successfully signed up.
 *       400:
 *         description: Invalid credentials.
 */
router.post('/sign-up', verifySchema(signupSchema, 'body'), signUp)

/**
@swagger
 * components:
 *   schemas:
 *     ForgetPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user.
 *           format: email
 *       required:
 *         - email
 *       example:
 *         email: alanperez@examplemail.com
 */

/**
 * @swagger
 * /api/v1/auth/forget-password:
 *   post:
 *     summary: Forget Password
 *     description: Forget Password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPassword'
 *     responses:
 *       200:
 *         description: Email sent successfully. Please check your email.
 *       500:
 *         description: Error sending email.
 *
 */
router.post(
  '/forget-password',
  verifySchema(forgetPasswordSchema, 'body'),
  forgetPassword
)

/**
 * @swagger
 * components:
 *  schemas:
 *   RestorePassword:
 *    type: object
 *    properties:
 *      password:
 *        type: string
 *        description: The password of the user.
 *      token:
 *        type: string
 *        description: The token of the user.
 *    required:
 *      - password
 *      - token
 *    example:
 *      password: examplepassword
 *      token: exampletoken
 */

/**
 * @swagger
 * /api/v1/auth/change-password/{token}:
 *   post:
 *     summary: Restore Password
 *     description: Restore Password
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestorePassword'
 *     responses:
 *       200:
 *         description: The password was successfully changed.
 *       401:
 *         description: Invalid token.
 *
 */
router.post(
  '/change-password/:token',
  verifySchema(restorePasswordSchema, 'body'),
  restorePassword
)

router.get('/me', userToken)

router.get(
  '/testing',
  async (request, response, next) => {
    try {
      return response.status(200).json({
        results: {
          user: request.user,
          isAuthenticated: request.isAuthenticated(),
          isUnauthenticated: request.isUnauthenticated(),
          _sessionManager: request._sessionManager,
          authInfo: request.authInfo,
        },
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

module.exports = router
