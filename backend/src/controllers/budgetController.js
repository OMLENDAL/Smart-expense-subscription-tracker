// This controller manages the budget endpoints.
const budgetService = require('../services/budgetService');

async function createBudget(req, res, next) {
  try {
    const budget = await budgetService.createNewBudget(req.user.id, req.body);
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
}

async function getBudgets(req, res, next) {
  try {
    const budgets = await budgetService.getUserBudgets(req.user.id);
    res.status(200).json({ success: true, data: budgets });
  } catch (error) {
    next(error);
  }
}

async function updateBudget(req, res, next) {
  try {
    const budget = await budgetService.updateExistingBudget(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
};
