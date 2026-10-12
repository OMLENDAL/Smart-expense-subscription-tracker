// Subscription routes follow the same simple pattern as expense routes.
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createSubscription, getAllSubscriptions, updateSubscription, deleteSubscription } = require('../controllers/subscriptionController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
