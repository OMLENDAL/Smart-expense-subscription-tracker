// These routes manage monthly category budgets.
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createBudget, getBudgets, updateBudget } = require('../controllers/budgetController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);

module.exports = router;
