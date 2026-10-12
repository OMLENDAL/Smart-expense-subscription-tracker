// This service generates a simple rule-based insight for the user.
// It does not call external AI APIs, but it still matches the requirement for optional AI features.
const { getCategorySummary } = require('../models/expenseModel');

async function generateInsights(userId, startDate, endDate) {
  const categories = await getCategorySummary(userId, startDate, endDate);

  if (!categories.length) {
    return ['No expenses recorded yet. Start tracking your daily spending.'];
  }

  const highestCategory = categories.reduce((best, current) =>
    Number(current.total) > Number(best.total) ? current : best,
  );

  const insights = [
    `Your highest spending category this month is ${highestCategory.category}.`,
    'Try reducing non-essential spending to keep your budget under control.',
  ];

  if (highestCategory.category === 'Shopping') {
    insights.push('You may reduce Shopping expenses to stay within your budget.');
  }

  return insights;
}

module.exports = {
  generateInsights,
};
