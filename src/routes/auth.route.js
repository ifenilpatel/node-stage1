const { Router } = require('express');
const router = Router();

const { ctrlSignIn } = require('../controllers/auth.controller.js');

const validate = require('../middlewares/validate.middleware.js');
const { signInSchema } = require('../validators/auth.validation.js');

router.post('/v1/api_signin', validate(signInSchema), ctrlSignIn);

module.exports = router;
