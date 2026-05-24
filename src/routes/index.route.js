const express = require('express');
const router = express.Router();

const apiRoutes = require('./api.route.js');
const authRoutes = require('./auth.route.js');
const userRoutes = require('./user.route.js');

router.use('/', apiRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;
