const { Router } = require('express');
const router = Router();

const {
  ctrlSelection,
  ctrlSelectById,
  ctrlSelectAll,
  ctrlInsert,
  ctrlUpdate,
  ctrlToggle
} = require('../controllers/department.controller.js');

const { auth } = require('../middlewares/auth.midddleware.js');
const validate = require('../middlewares/validate.middleware');

const {
  selectionSchema,
  selectByIdSchema,
  selectAllSchema,
  insertSchema,
  updateSchema,
  toggleSchema
} = require('../validators/department.validation.js');

router.post('/v1/api_selection', auth, validate(selectionSchema), ctrlSelection);

router.post('/v1/api_selectbyid', auth, validate(selectByIdSchema), ctrlSelectById);

router.post('/v1/api_selectall', auth, validate(selectAllSchema), ctrlSelectAll);

router.post('/v1/api_insert', auth, validate(insertSchema), ctrlInsert);

router.post('/v1/api_update', auth, validate(updateSchema), ctrlUpdate);

router.post('/v1/api_toggle', auth, validate(toggleSchema), ctrlToggle);

module.exports = router;
