const express = require('express');
const {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const validate = require('../middlewares/validate');
const Joi = require('joi');

const router = express.Router();

const recordSchema = Joi.object({
  amount: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().required(),
  date: Joi.date().iso(),
  notes: Joi.string().max(500).allow('', null)
});

// All routes require authentication
router.use(protect);

// Viewer, Analyst, and Admin can view records
router.get('/', getRecords);
router.get('/:id', getRecord);

// Only Admins can modify records
router.post('/', authorize('Admin'), validate(recordSchema), createRecord);
router.put('/:id', authorize('Admin'), validate(Joi.object({
  amount: Joi.number(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string(),
  date: Joi.date().iso(),
  notes: Joi.string().max(500).allow('', null)
})), updateRecord);
router.delete('/:id', authorize('Admin'), deleteRecord);

module.exports = router;
