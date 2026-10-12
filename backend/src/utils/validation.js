// This file contains reusable validation helpers for user input.
// Validation is kept here so controllers remain small and easy to read.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegistrationInput({ name, email, password }) {
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Valid email is required');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  return true;
}

function validateLoginInput({ email, password }) {
  if (!email || !isValidEmail(email)) {
    throw new Error('Valid email is required');
  }

  if (!password) {
    throw new Error('Password is required');
  }

  return true;
}

function validateExpenseInput(data) {
  if (!data.amount || Number(data.amount) <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (!data.category) {
    throw new Error('Category is required');
  }

  if (!data.expense_date) {
    throw new Error('Expense date is required');
  }

  return true;
}

function validateSubscriptionInput(data) {
  if (!data.name || !data.name.trim()) {
    throw new Error('Subscription name is required');
  }

  if (!data.amount || Number(data.amount) <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (!data.billing_cycle) {
    throw new Error('Billing cycle is required');
  }

  if (!data.next_payment_date) {
    throw new Error('Next payment date is required');
  }

  return true;
}

function validateBudgetInput(data) {
  if (!data.category || !data.category.trim()) {
    throw new Error('Category is required');
  }

  if (!data.limit_amount || Number(data.limit_amount) <= 0) {
    throw new Error('Budget amount must be greater than 0');
  }

  if (!data.month) {
    throw new Error('Month is required');
  }

  return true;
}

module.exports = {
  isValidEmail,
  validateRegistrationInput,
  validateLoginInput,
  validateExpenseInput,
  validateSubscriptionInput,
  validateBudgetInput,
};
