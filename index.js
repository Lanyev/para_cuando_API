const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');
const routerModels = require('./routes/models.router');
const routerErrorHandler = require('./routes/errorhandler.router');
const { swaggerDocs } = require('./swagger.js');

const app = express();
const PORT = process.env.PORT || 8000;
swaggerDocs(app, PORT);

const whitelist = ['http://localhost:8000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Denied By CORS'));
    }
  },
};

if (process.env.NODE_ENV === 'production') {
  app.use(cors());
  /* Set security HTTP headers */
  /* For Error ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200 
       https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
  */
  app.use(helmet({ crossOriginResourcePolicy: false }));
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', ({ res }) => {
  return res.json({
    status: 'Up',
    maintenance: false,
  });
});

routerModels(app);
routerErrorHandler(app);

if (process.env.NODE_ENV != 'test') {
  app.listen(PORT, () =>
    console.log(`S erver running on http://localhost:${PORT}`)
  );
}

module.exports = { app };
