// This controller handles CRUD operations for subscriptions.
const subscriptionService = require('../services/subscriptionService');

async function createSubscription(req, res, next) {
  try {
    const subscription = await subscriptionService.createNewSubscription(req.user.id, req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
}

async function getAllSubscriptions(req, res, next) {
  try {
    const subscriptions = await subscriptionService.getUserSubscriptions(req.user.id);
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const subscription = await subscriptionService.updateExistingSubscription(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
}

async function deleteSubscription(req, res, next) {
  try {
    const subscription = await subscriptionService.deleteExistingSubscription(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: subscription, message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
};
