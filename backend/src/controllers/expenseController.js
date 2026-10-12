// This controller manages the HTTP requests for expense operations.
const expenseService = require('../services/expenseService');

async function createExpense(req, res, next) {
  try {
    const expense = await expenseService.createNewExpense(req.user.id, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
}

async function getAllExpenses(req, res, next) {
  try {
    const expenses = await expenseService.getUserExpenses(req.user.id);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
}

async function getExpenseById(req, res, next) {
  try {
    const expense = await expenseService.getExpenseByUserId(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const expense = await expenseService.updateExistingExpense(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expense = await expenseService.deleteExistingExpense(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: expense, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
