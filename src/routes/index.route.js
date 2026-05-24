const express = require('express');
const router = express.Router();

const apiRoutes = require('./api.route.js');

router.use('/', apiRoutes);

module.exports = router;
