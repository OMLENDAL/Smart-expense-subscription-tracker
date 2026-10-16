const bcrypt = require('bcryptjs');
const db = require('../config/database');

const DEMO_NAME = 'Demo Admin';
const DEMO_EMAIL = 'admin@gmail.com';
const DEMO_PASSWORD = 'admin';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateOffset(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function getExpenseDate(daysAgo) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(Math.max(1, date.getDate() - daysAgo));
  return formatDate(date);
}

async function seedDemoAccount() {
  const currentDate = new Date();
  const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const expenses = [
    { amount: 1450, category: 'Food', description: 'Weekly groceries', expense_date: getExpenseDate(0), payment_method: 'UPI' },
    { amount: 850, category: 'Travel', description: 'Metro and cab rides', expense_date: getExpenseDate(2), payment_method: 'UPI' },
    { amount: 2799, category: 'Shopping', description: 'Household essentials', expense_date: getExpenseDate(4), payment_method: 'Credit Card' },
    { amount: 1649, category: 'Bills', description: 'Electricity and water bill', expense_date: getExpenseDate(6), payment_method: 'Net Banking' },
    { amount: 649, category: 'Entertainment', description: 'Movie night', expense_date: getExpenseDate(8), payment_method: 'Credit Card' },
    { amount: 1200, category: 'Education', description: 'Online course', expense_date: getExpenseDate(10), payment_method: 'Debit Card' },
    { amount: 680, category: 'Health', description: 'Pharmacy', expense_date: getExpenseDate(12), payment_method: 'UPI' },
    { amount: 499, category: 'Other', description: 'Home supplies', expense_date: getExpenseDate(14), payment_method: 'Cash' },
  ];
  const budgets = [
    { category: 'Food', limit_amount: 6000 },
    { category: 'Travel', limit_amount: 5000 },
    { category: 'Shopping', limit_amount: 7000 },
    { category: 'Bills', limit_amount: 5000 },
    { category: 'Entertainment', limit_amount: 2500 },
    { category: 'Education', limit_amount: 4000 },
    { category: 'Health', limit_amount: 3000 },
    { category: 'Other', limit_amount: 2000 },
  ].map((budget) => ({ ...budget, month }));
  const subscriptions = [
    { name: 'Netflix', amount: 649, billing_cycle: 'Monthly', next_payment_date: getDateOffset(3), category: 'Entertainment', status: 'Active' },
    { name: 'Spotify Premium', amount: 119, billing_cycle: 'Monthly', next_payment_date: getDateOffset(7), category: 'Entertainment', status: 'Active' },
    { name: 'Cloud storage', amount: 199, billing_cycle: 'Monthly', next_payment_date: getDateOffset(12), category: 'Other', status: 'Active' },
    { name: 'Gym membership', amount: 1499, billing_cycle: 'Monthly', next_payment_date: getDateOffset(20), category: 'Health', status: 'Active' },
    { name: 'Online newspaper', amount: 299, billing_cycle: 'Monthly', next_payment_date: getDateOffset(26), category: 'Education', status: 'Cancelled' },
  ];
  const notifications = [
    { message: 'Your Netflix subscription renews soon.', type: 'info' },
    { message: 'You are on track with your monthly budgets.', type: 'success' },
    { message: 'Your monthly spending summary is ready to explore.', type: 'info' },
  ];

  const result = await db.query(
    `WITH demo_user AS (
       INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id
     ),
     sample_expenses AS (
       INSERT INTO expenses (user_id, amount, category, description, expense_date, payment_method)
       SELECT demo_user.id, seed.amount, seed.category, seed.description, seed.expense_date, seed.payment_method
       FROM demo_user
       CROSS JOIN json_to_recordset($4::json) AS seed(
         amount numeric, category text, description text, expense_date date, payment_method text
       )
       RETURNING id
     ),
     sample_subscriptions AS (
       INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_payment_date, category, status)
       SELECT demo_user.id, seed.name, seed.amount, seed.billing_cycle, seed.next_payment_date, seed.category, seed.status
       FROM demo_user
       CROSS JOIN json_to_recordset($5::json) AS seed(
         name text, amount numeric, billing_cycle text, next_payment_date date, category text, status text
       )
       RETURNING id
     ),
     sample_budgets AS (
       INSERT INTO budgets (user_id, category, limit_amount, month)
       SELECT demo_user.id, seed.category, seed.limit_amount, seed.month
       FROM demo_user
       CROSS JOIN json_to_recordset($6::json) AS seed(
         category text, limit_amount numeric, month varchar
       )
       RETURNING id
     ),
     sample_notifications AS (
       INSERT INTO notifications (user_id, message, type, is_read)
       SELECT demo_user.id, seed.message, seed.type, false
       FROM demo_user
       CROSS JOIN json_to_recordset($7::json) AS seed(message text, type text)
       RETURNING id
     )
     SELECT id FROM demo_user`,
    [
      DEMO_NAME,
      DEMO_EMAIL,
      passwordHash,
      JSON.stringify(expenses),
      JSON.stringify(subscriptions),
      JSON.stringify(budgets),
      JSON.stringify(notifications),
    ],
  );

  if (result.rows.length > 0) {
    console.log(`Seeded local demo account: ${DEMO_EMAIL}`);
  }
}

module.exports = { seedDemoAccount };
