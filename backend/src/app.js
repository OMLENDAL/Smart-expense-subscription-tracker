// This file builds the Express application and mounts all routes.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Expense & Subscription Tracker API',
      version: '1.0.0',
      description: 'Simple beginner-friendly API for expenses, subscriptions, budgets, and notifications.',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorMiddleware);

module.exports = app;
