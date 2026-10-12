// Notification routes allow users to view and mark alerts as read.
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getNotifications, markRead } = require('../controllers/notificationController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getNotifications);
router.put('/:id/read', markRead);

module.exports = router;
