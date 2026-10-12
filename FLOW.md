# Application Flow

This file explains how the application works step by step.

## Complete System Flow
```mermaid
flowchart TD
    A[User] --> B[React Frontend]
    B --> C[Express REST API]
    C --> D[Controller]
    D --> E[Service]
    E --> F[Model]
    F --> G[(PostgreSQL)]
    G --> F
    F --> E
    E --> D
    D --> C
    C --> B
    B --> A
```

This diagram shows the standard route-to-controller-to-service-to-model architecture used in the app.

## Login Flow
```mermaid
flowchart TD
    A[User enters email and password] --> B[React Login Page]
    B --> C[Login API]
    C --> D[Auth Controller]
    D --> E[Check User]
    E --> F[Compare Password using bcrypt]
    F --> G{Valid?}
    G -->|Yes| H[Generate JWT]
    H --> I[Return Token]
    I --> J[Open Dashboard]
    G -->|No| K[Return Login Error]
```

The login flow is the heart of security. Passwords are compared using bcrypt, and the backend creates a JWT only when the credentials are valid.

## Add Expense Flow
```mermaid
flowchart TD
    A[User opens Add Expense] --> B[Enter Expense Details]
    B --> C[Frontend Validation]
    C --> D[POST Expense API]
    D --> E[Expense Controller]
    E --> F[Expense Service]
    F --> G[Expense Model]
    G --> H[(PostgreSQL)]
    H --> I[Expense Saved]
    I --> J[Return Response]
    J --> K[Update Expense List]
```

The form validates values before sending the request. The backend then checks the data and stores it in PostgreSQL.

## Dashboard Flow
```mermaid
flowchart TD
    A[User Opens Dashboard] --> B[Dashboard API]
    B --> C[Get Expenses]
    B --> D[Get Budgets]
    B --> E[Get Subscriptions]
    C --> F[Calculate Summary]
    D --> F
    E --> F
    F --> G[Return Dashboard Data]
    G --> H[Display Cards]
    G --> I[Display Charts]
```

The dashboard combines several data sources to show totals, remaining budget, and category trends.

## Database Flow
```mermaid
erDiagram
    USERS ||--o{ EXPENSES : has
    USERS ||--o{ SUBSCRIPTIONS : has
    USERS ||--o{ BUDGETS : creates
    USERS ||--o{ NOTIFICATIONS : receives
```

The database is designed so each user has their own expenses, subscriptions, budgets, and notifications.
