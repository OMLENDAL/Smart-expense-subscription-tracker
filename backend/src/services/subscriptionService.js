// This service handles subscription CRUD and basic recurring checks.
const {
  createSubscription,
  getSubscriptionsByUser,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require('../models/subscriptionModel');
const { validateSubscriptionInput } = require('../utils/validation');

async function createNewSubscription(userId, payload) {
  validateSubscriptionInput(payload);

  return createSubscription({
    user_id: userId,
    name: payload.name,
    amount: payload.amount,
    billing_cycle: payload.billing_cycle,
    next_payment_date: payload.next_payment_date,
    category: payload.category || 'Other',
    status: payload.status || 'Active',
  });
}

async function getUserSubscriptions(userId) {
  return getSubscriptionsByUser(userId);
}

async function getSubscriptionByUserId(subscriptionId, userId) {
  const subscription = await getSubscriptionById(subscriptionId, userId);
  if (!subscription) {
    throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
  }

  return subscription;
}

async function updateExistingSubscription(subscriptionId, userId, payload) {
  validateSubscriptionInput(payload);

  const updatedSubscription = await updateSubscription(subscriptionId, userId, payload);
  if (!updatedSubscription) {
    throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
  }

  return updatedSubscription;
}

async function deleteExistingSubscription(subscriptionId, userId) {
  const deletedSubscription = await deleteSubscription(subscriptionId, userId);
  if (!deletedSubscription) {
    throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
  }

  return deletedSubscription;
}

module.exports = {
  createNewSubscription,
  getUserSubscriptions,
  getSubscriptionByUserId,
  updateExistingSubscription,
  deleteExistingSubscription,
};
