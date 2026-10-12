# API Documentation

This document gives a simple overview of the backend REST API.

## Authentication APIs

### POST /api/auth/register
Purpose: Create a new account.
Authentication: Not required.
Request Body:
```json
{
  "name": "Riya",
  "email": "riya@example.com",
  "password": "secret123"
}
```
Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Riya",
    "email": "riya@example.com"
  },
  "token": "jwt-token"
}
```

### POST /api/auth/login
Purpose: Log in an existing user.
Authentication: Not required.
Request Body:
```json
{
  "email": "riya@example.com",
  "password": "secret123"
}
```

## Expense APIs

### GET /api/expenses
Purpose: Get all expenses for the logged-in user.
Authentication: Required.

### POST /api/expenses
Purpose: Add a new expense.
Authentication: Required.
Request Body:
```json
{
  "amount": 500,
  "category": "Food",
  "description": "Lunch",
  "expense_date": "2026-10-06",
  "payment_method": "UPI"
}
```

### PUT /api/expenses/:id
Purpose: Update an existing expense.
Authentication: Required.

### DELETE /api/expenses/:id
Purpose: Delete an expense.
Authentication: Required.

## Subscription APIs

### GET /api/subscriptions
Purpose: Get subscription records.
Authentication: Required.

### POST /api/subscriptions
Purpose: Add a new subscription.
Authentication: Required.
Request Body:
```json
{
  "name": "Netflix",
  "amount": 649,
  "billing_cycle": "Monthly",
  "next_payment_date": "2026-10-15",
  "category": "Entertainment",
  "status": "Active"
}
```

### PUT /api/subscriptions/:id
Purpose: Edit a subscription.
Authentication: Required.

### DELETE /api/subscriptions/:id
Purpose: Delete a subscription.
Authentication: Required.

## Budget APIs

### GET /api/budgets
Purpose: Get budgets for the user.
Authentication: Required.

### POST /api/budgets
Purpose: Create a budget.
Authentication: Required.
Request Body:
```json
{
  "category": "Food",
  "limit_amount": 5000,
  "month": "2026-10"
}
```

### PUT /api/budgets/:id
Purpose: Update an existing budget.
Authentication: Required.

## Dashboard APIs

### GET /api/dashboard/summary
Purpose: Get the dashboard summary card data.
Authentication: Required.

## Notification APIs

### GET /api/notifications
Purpose: Get notifications for the user.
Authentication: Required.

### PUT /api/notifications/:id/read
Purpose: Mark a notification as read.
Authentication: Required.
