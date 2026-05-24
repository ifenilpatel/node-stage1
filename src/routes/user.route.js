const { Router } = require('express');
const router = Router();

const {
  ctrlSelection,
  ctrlSelectById,
  ctrlSelectAll,
  ctrlInsert,
  ctrlUpdate,
  ctrlToggle
} = require('../controllers/user.controller.js');

const validate = require('../middlewares/validate.middleware');

const {
  selectionSchema,
  selectByIdSchema,
  selectAllSchema,
  insertSchema,
  updateSchema,
  toggleSchema
} = require('../validators/user.validation.js');

router.post('/v1/api_selection', validate(selectionSchema), ctrlSelection);

router.post('/v1/api_selectbyid', validate(selectByIdSchema), ctrlSelectById);

router.post('/v1/api_selectall', validate(selectAllSchema), ctrlSelectAll);

router.post('/v1/api_insert', validate(insertSchema), ctrlInsert);

router.post('/v1/api_update', validate(updateSchema), ctrlUpdate);

router.post('/v1/api_toggle', validate(toggleSchema), ctrlToggle);

module.exports = router;
