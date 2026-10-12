// This service creates simple notifications based on user activity.
const { createNotification, getNotificationsByUser, markNotificationAsRead } = require('../models/notificationModel');

async function getUserNotifications(userId) {
  return getNotificationsByUser(userId);
}

async function markNotificationRead(notificationId, userId) {
  const notification = await markNotificationAsRead(notificationId, userId);
  if (!notification) {
    throw Object.assign(new Error('Notification not found'), { statusCode: 404 });
  }

  return notification;
}

async function createUserNotification(userId, message, type = 'info') {
  return createNotification({ user_id: userId, message, type });
}

module.exports = {
  getUserNotifications,
  markNotificationRead,
  createUserNotification,
};
