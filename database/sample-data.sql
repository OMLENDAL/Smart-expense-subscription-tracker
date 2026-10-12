-- Sample records used during local development.
-- This file is optional but useful when a beginner wants to test the app quickly.

INSERT INTO users (name, email, password) VALUES
('Demo User', 'demo@example.com', 'hashed-password');

INSERT INTO expenses (user_id, amount, category, description, expense_date, payment_method) VALUES
(1, 250.00, 'Food', 'Groceries', '2026-10-01', 'UPI'),
(1, 1250.00, 'Travel', 'Train ticket', '2026-10-03', 'Debit Card'),
(1, 649.00, 'Entertainment', 'Netflix', '2026-10-05', 'Credit Card');

INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_payment_date, category, status) VALUES
(1, 'Netflix', 649.00, 'Monthly', '2026-10-15', 'Entertainment', 'Active'),
(1, 'Spotify', 199.00, 'Monthly', '2026-10-18', 'Entertainment', 'Active');

INSERT INTO budgets (user_id, category, limit_amount, month) VALUES
(1, 'Food', 5000.00, '2026-10'),
(1, 'Travel', 3000.00, '2026-10'),
(1, 'Shopping', 4000.00, '2026-10');
