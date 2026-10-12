// This model manages expense records in PostgreSQL.
// The service layer calls these methods to perform CRUD actions cleanly.
const db = require('../config/database');

async function createExpense({ user_id, amount, category, description, expense_date, payment_method }) {
  const result = await db.query(
    `INSERT INTO expenses (user_id, amount, category, description, expense_date, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, Number(amount), category, description, expense_date, payment_method],
  );

  return result.rows[0];
}

async function getExpensesByUser(userId) {
  const result = await db.query(
    `SELECT * FROM expenses
     WHERE user_id = $1
     ORDER BY expense_date DESC, created_at DESC`,
    [userId],
  );

  return result.rows;
}

async function getExpenseById(expenseId, userId) {
  const result = await db.query(
    `SELECT * FROM expenses
     WHERE id = $1 AND user_id = $2`,
    [expenseId, userId],
  );

  return result.rows[0] || null;
}

async function updateExpense(expenseId, userId, data) {
  const result = await db.query(
    `UPDATE expenses
     SET amount = $1,
         category = $2,
         description = $3,
         expense_date = $4,
         payment_method = $5
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [Number(data.amount), data.category, data.description, data.expense_date, data.payment_method, expenseId, userId],
  );

  return result.rows[0] || null;
}

async function deleteExpense(expenseId, userId) {
  const result = await db.query(
    `DELETE FROM expenses
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [expenseId, userId],
  );

  return result.rows[0] || null;
}

async function getMonthlySummary(userId, monthStart, monthEnd) {
  const result = await db.query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE user_id = $1 AND expense_date BETWEEN $2 AND $3`,
    [userId, monthStart, monthEnd],
  );

  return Number(result.rows[0].total || 0);
}

async function getCategorySummary(userId, monthStart, monthEnd) {
  const result = await db.query(
    `SELECT category, SUM(amount) AS total
     FROM expenses
     WHERE user_id = $1 AND expense_date BETWEEN $2 AND $3
     GROUP BY category
     ORDER BY total DESC`,
    [userId, monthStart, monthEnd],
  );

  return result.rows;
}

module.exports = {
  createExpense,
  getExpensesByUser,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getCategorySummary,
};
