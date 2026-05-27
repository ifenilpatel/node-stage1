require('../env.js');

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const HTTP_STATUS = require('./constants/httpStatus.js');
const HTTP_CODE = require('./constants/httpCode.js');

const errorHandler = require('./middlewares/error.middleware');

const logger = require('./utils/logger.util.js');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const indexRoutes = require('./routes/index.route.js');

app.use('/', indexRoutes);

app.use((req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    http_code: HTTP_CODE.ROUTE_NOT_FOUND,
    message: 'Route not found.'
  });
});

app.use(errorHandler);

module.exports = app;
