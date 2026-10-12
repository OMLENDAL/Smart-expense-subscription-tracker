// This service prepares the dashboard summary used by the main page after login.
const { getUserExpenses } = require('./expenseService');
const { getUserSubscriptions } = require('./subscriptionService');
const { getUserBudgets } = require('./budgetService');
const { getCategorySummary, getMonthlySummary } = require('../models/expenseModel');

async function getDashboardSummary(userId) {
  const expenses = await getUserExpenses(userId);
  const subscriptions = await getUserSubscriptions(userId);
  const budgets = await getUserBudgets(userId);

  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const monthStart = `${currentMonth}-01`;
  const monthEnd = `${currentMonth}-31`;

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const monthlyExpense = await getMonthlySummary(userId, monthStart, monthEnd);
  const budgetTotal = budgets.reduce((sum, item) => sum + Number(item.limit_amount), 0);
  const remainingBudget = budgetTotal - monthlyExpense;

  const categoryData = await getCategorySummary(userId, monthStart, monthEnd);
  const subscriptionsSoon = subscriptions
    .filter((item) => item.status !== 'Cancelled')
    .slice(0, 5);

  return {
    totalExpense,
    monthlyExpense,
    budgetTotal,
    remainingBudget,
    categoryData,
    recentExpenses: expenses.slice(0, 5),
    upcomingSubscriptions: subscriptionsSoon,
    budgets,
    subscriptions,
  };
}

module.exports = {
  getDashboardSummary,
};
