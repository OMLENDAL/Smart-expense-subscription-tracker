// This model handles user budgets per category and month.
// Budgets are stored separately so dashboard calculations can remain simple.
const db = require('../config/database');

async function createBudget({ user_id, category, limit_amount, month }) {
  const result = await db.query(
    `INSERT INTO budgets (user_id, category, limit_amount, month)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, category, Number(limit_amount), month],
  );

  return result.rows[0];
}

async function getBudgetsByUser(userId) {
  const result = await db.query(
    `SELECT * FROM budgets
     WHERE user_id = $1
     ORDER BY month DESC`,
    [userId],
  );

  return result.rows;
}

async function getBudgetById(budgetId, userId) {
  const result = await db.query(
    `SELECT * FROM budgets
     WHERE id = $1 AND user_id = $2`,
    [budgetId, userId],
  );

  return result.rows[0] || null;
}

async function updateBudget(budgetId, userId, data) {
  const result = await db.query(
    `UPDATE budgets
     SET category = $1,
         limit_amount = $2,
         month = $3
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [data.category, Number(data.limit_amount), data.month, budgetId, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  createBudget,
  getBudgetsByUser,
  getBudgetById,
  updateBudget,
};
