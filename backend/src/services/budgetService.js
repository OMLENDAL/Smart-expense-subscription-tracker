// This service manages monthly category budgets and budget warnings.
const { createBudget, getBudgetsByUser, updateBudget } = require('../models/budgetModel');
const { validateBudgetInput } = require('../utils/validation');
const { getCategorySummary } = require('../models/expenseModel');

async function createNewBudget(userId, payload) {
  validateBudgetInput(payload);

  return createBudget({
    user_id: userId,
    category: payload.category,
    limit_amount: payload.limit_amount,
    month: payload.month,
  });
}

async function getUserBudgets(userId) {
  return getBudgetsByUser(userId);
}

async function updateExistingBudget(budgetId, userId, payload) {
  validateBudgetInput(payload);

  const updatedBudget = await updateBudget(budgetId, userId, payload);
  if (!updatedBudget) {
    throw Object.assign(new Error('Budget not found'), { statusCode: 404 });
  }

  return updatedBudget;
}

async function getBudgetWarnings(userId) {
  const budgets = await getBudgetsByUser(userId);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const warnings = [];

  for (const budget of budgets) {
    if (budget.month !== currentMonth) continue;

    const rows = await getCategorySummary(userId, `${budget.month}-01`, `${budget.month}-31`);
    const categorySpent = rows.find((row) => row.category === budget.category);
    const spentValue = Number(categorySpent?.total || 0);
    const remaining = Number(budget.limit_amount) - spentValue;

    if (spentValue >= Number(budget.limit_amount)) {
      warnings.push({
        category: budget.category,
        message: `You have crossed your ${budget.category} budget.`,
        type: 'warning',
      });
    } else if (remaining <= Number(budget.limit_amount) * 0.2) {
      warnings.push({
        category: budget.category,
        message: `You are close to your ${budget.category} budget.`,
        type: 'info',
      });
    }
  }

  return warnings;
}

module.exports = {
  createNewBudget,
  getUserBudgets,
  updateExistingBudget,
  getBudgetWarnings,
};
