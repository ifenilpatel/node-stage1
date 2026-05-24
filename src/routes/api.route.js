const express = require('express');
const router = express.Router();

const { ctrlInit } = require('../controllers/api.controller');

router.get('/', ctrlInit);

module.exports = router;
