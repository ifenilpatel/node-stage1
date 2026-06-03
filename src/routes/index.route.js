const express = require('express');

const HTTP_CODE = require('../constants/httpCode.js');
const HTTP_STATUS = require('../constants/httpStatus.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    http_code: HTTP_CODE.SUCCESS,
    message: 'API is running',
    data: null
  });
});

module.exports = router;
