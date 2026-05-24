const APIResponse = require('../classes/APIResponse.js');

const authService = require('../services/auth.service.js');

const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const ctrlSignIn = async (req, res, next) => {
  try {
    const { first_name } = req.body;

    const result = await authService.signIn({
      first_name
    });

    res
      .status(HTTP_STATUS.OK)
      .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Login successful', result));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ctrlSignIn
};
