const APIResponse = require('../classes/APIResponse.js');

const DepartmentDTO = require('../classes/dto/department.dto.js');

const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const asyncHandler = require('../utils/asyncHandler.util.js');
const { getPaginationContext } = require('../utils/common.util.js');

const departmentService = require('../services/department.service.js');

const ctrlSelection = asyncHandler(async (req, res) => {
  const { offset, page_index, page_size } = getPaginationContext(req);
  const { selected_departments = [] } = req.body;

  const search = req.body?.search ?? {};

  const result = await departmentService.select({
    offset,
    page_index,
    page_size,
    selected_departments,
    search
  });

  result.selected = DepartmentDTO.toResponseSelection(result.selected);

  result.records = DepartmentDTO.toResponseSelection(result.records);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Departments fetched successfully.', result)
    );
});

const ctrlSelectById = asyncHandler(async (req, res) => {
  const { department_id } = req.body;

  const findUser = await departmentService.detail({
    department_id
  });

  const result = DepartmentDTO.toResponse(findUser);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Department fetched successfully.', result)
    );
});

const ctrlSelectAll = asyncHandler(async (req, res) => {
  const { offset, page_index, page_size } = getPaginationContext(req);

  const search = req.body?.search ?? {};

  const result = await departmentService.list({
    offset,
    page_index,
    page_size,
    search
  });

  result.data = DepartmentDTO.toResponseList(result.data);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Departments fetched successfully.', result)
    );
});

const ctrlInsert = asyncHandler(async (req, res) => {
  const payload = new DepartmentDTO(req.body);

  const result = await departmentService.create(payload);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Department created successfully.', result)
    );
});

const ctrlUpdate = asyncHandler(async (req, res) => {
  const payload = new DepartmentDTO(req.body);

  await departmentService.update(payload);

  res
    .status(HTTP_STATUS.OK)
    .json(new APIResponse(HTTP_STATUS.OK, HTTP_CODE.OK, 'Department updated successfully.'));
});

const ctrlToggle = asyncHandler(async (req, res) => {
  const { department_id } = req.body;

  const result = await departmentService.toggle({
    department_id
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIResponse(
        HTTP_STATUS.OK,
        HTTP_CODE.OK,
        `Department ${result.is_active ? 'activated' : 'deactivated'} successfully.`
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
