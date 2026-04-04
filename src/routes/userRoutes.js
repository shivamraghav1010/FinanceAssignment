const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin')); // All routes in this file require Admin access

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
