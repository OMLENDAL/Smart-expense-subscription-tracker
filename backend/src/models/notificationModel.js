// This model stores user notifications and read status.
// It supports budget and subscription alerts in a simple way.
const db = require('../config/database');

async function createNotification({ user_id, message, type = 'info' }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, message, type, is_read)
     VALUES ($1, $2, $3, false)
     RETURNING *`,
    [user_id, message, type],
  );

  return result.rows[0];
}

async function getNotificationsByUser(userId) {
  const result = await db.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

async function markNotificationAsRead(notificationId, userId) {
  const result = await db.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
};
