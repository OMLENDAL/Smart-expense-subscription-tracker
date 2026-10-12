// Expense routes are grouped here for easier API organization.
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllExpenses);
router.post('/', createExpense);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
