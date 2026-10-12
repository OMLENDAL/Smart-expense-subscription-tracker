// This service contains all business logic for expense operations.
// It validates input and coordinates model access before returning responses.
const {
  createExpense,
  getExpensesByUser,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../models/expenseModel');
const { validateExpenseInput } = require('../utils/validation');

async function createNewExpense(userId, payload) {
  validateExpenseInput(payload);

  return createExpense({
    user_id: userId,
    amount: payload.amount,
    category: payload.category,
    description: payload.description || '',
    expense_date: payload.expense_date,
    payment_method: payload.payment_method || 'Other',
  });
}

async function getUserExpenses(userId) {
  return getExpensesByUser(userId);
}

async function getExpenseByUserId(expenseId, userId) {
  const expense = await getExpenseById(expenseId, userId);
  if (!expense) {
    throw Object.assign(new Error('Expense not found'), { statusCode: 404 });
  }

  return expense;
}

async function updateExistingExpense(expenseId, userId, payload) {
  validateExpenseInput(payload);

  const updatedExpense = await updateExpense(expenseId, userId, payload);
  if (!updatedExpense) {
    throw Object.assign(new Error('Expense not found'), { statusCode: 404 });
  }

  return updatedExpense;
}

async function deleteExistingExpense(expenseId, userId) {
  const expense = await deleteExpense(expenseId, userId);
  if (!expense) {
    throw Object.assign(new Error('Expense not found'), { statusCode: 404 });
  }

  return expense;
}

module.exports = {
  createNewExpense,
  getUserExpenses,
  getExpenseByUserId,
  updateExistingExpense,
  deleteExistingExpense,
};
