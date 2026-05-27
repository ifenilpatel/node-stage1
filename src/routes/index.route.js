const express = require('express');
const router = express.Router();

const apiRoutes = require('./api.route.js');
const authRoutes = require('./auth.route.js');
const userRoutes = require('./user.route.js');
const departmentRoutes = require('./department.route.js');

router.use('/', apiRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/department', departmentRoutes);

module.exports = router;
