const APIResponse = require('../classes/APIResponse.js');

const UserDTO = require('../classes/dto/user.dto.js');

const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const asyncHandler = require('../utils/asyncHandler.util.js');
const { getPaginationContext } = require('../utils/common.util.js');

const userService = require('../services/user.service.js');

const ctrlSelection = asyncHandler(async (req, res) => {
  const { offset, page_index, page_size } = getPaginationContext(req);
  const { selected_users = [] } = req.body;

  const search = req.body?.search ?? {};

  const result = await userService.select({
    offset,
    page_index,
    page_size,
    selected_users,
    search
  });

  result.selected = UserDTO.toResponseSelection(result.selected);

  result.records = UserDTO.toResponseSelection(result.records);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Users fetched successfully.', result));
});

const ctrlSelectById = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  const findUser = await userService.detail({
    user_id
  });

  const result = UserDTO.toResponse(findUser);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'User fetched successfully.', result));
});

const ctrlSelectAll = asyncHandler(async (req, res) => {
  const { offset, page_index, page_size } = getPaginationContext(req);

  const search = req.body?.search ?? {};

  const result = await userService.list({
    offset,
    page_index,
    page_size,
    search
  });

  result.data = UserDTO.toResponseList(result.data);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Users fetched successfully.', result));
});

const ctrlInsert = asyncHandler(async (req, res) => {
  const payload = new UserDTO(req.body);

  const result = await userService.create(payload);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'User created successfully.', result));
});

const ctrlUpdate = asyncHandler(async (req, res) => {
  const payload = new UserDTO(req.body);

  await userService.update(payload);

  res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'User updated successfully.'));
});

const ctrlToggle = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  const result = await userService.toggle({
    user_id
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(
        HTTP_STATUS.OK,
        HTTP_CODE.OK,
        `User ${result.is_active ? 'activated' : 'deactivated'} successfully.`
      )
    );
});

module.exports = {
  ctrlSelection,
  ctrlSelectById,
  ctrlSelectAll,
  ctrlInsert,
  ctrlUpdate,
  ctrlToggle
};
