// This model stores recurring subscriptions for each user.
// Subscription logic is kept here so the controller stays focused on HTTP flow.
const db = require('../config/database');

async function createSubscription({ user_id, name, amount, billing_cycle, next_payment_date, category, status }) {
  const result = await db.query(
    `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_payment_date, category, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, name, Number(amount), billing_cycle, next_payment_date, category, status || 'Active'],
  );

  return result.rows[0];
}

async function getSubscriptionsByUser(userId) {
  const result = await db.query(
    `SELECT * FROM subscriptions
     WHERE user_id = $1
     ORDER BY next_payment_date ASC`,
    [userId],
  );

  return result.rows;
}

async function getSubscriptionById(subscriptionId, userId) {
  const result = await db.query(
    `SELECT * FROM subscriptions
     WHERE id = $1 AND user_id = $2`,
    [subscriptionId, userId],
  );

  return result.rows[0] || null;
}

async function updateSubscription(subscriptionId, userId, data) {
  const result = await db.query(
    `UPDATE subscriptions
     SET name = $1,
         amount = $2,
         billing_cycle = $3,
         next_payment_date = $4,
         category = $5,
         status = $6
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [data.name, Number(data.amount), data.billing_cycle, data.next_payment_date, data.category, data.status, subscriptionId, userId],
  );

  return result.rows[0] || null;
}

async function deleteSubscription(subscriptionId, userId) {
  const result = await db.query(
    `DELETE FROM subscriptions
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [subscriptionId, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  createSubscription,
  getSubscriptionsByUser,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
