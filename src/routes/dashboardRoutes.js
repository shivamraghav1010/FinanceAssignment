const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

// Analysts and Admins can view the dashboard
router.get('/summary', authorize('Analyst', 'Admin'), getSummary);

module.exports = router;
