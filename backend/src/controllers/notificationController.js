// This controller manages notification requests.
const notificationService = require('../services/notificationService');

async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markRead,
};
